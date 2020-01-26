<template>
  <v-card
    class="file-upload-container mb-5"
    :loading="uploading"
  >
    <v-form
      ref="uploadForm"
      v-model="valid"
    >
      <v-card-title>
        <v-file-input
          v-show="!fileUploaded"
          v-model="file"
          accept="image/*"
          label="Select media"
          show-size
          prepend-icon="fa-folder-open"
          :loading="filePreProcessing"
          :success="fileUploaded"
          :error="hasError"
          :error-messages="error"
          single-line
          dense
          :rules="imageRules"
          :truncate-length="99999"
          @change="pickedFile"
        />
        <span
          v-if="fileUploaded"
        >
          {{ record.md5 }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            :cols="previewCols"
            class="preview-col"
          >
            <v-img
              v-show="showPreview"
              :src="imagePreview"
              :class="{ expanded: bigPreview, 'preview-image': true }"
              contain
              @click.stop="bigPreview = !bigPreview"
            />
          </v-col>
          <v-col
            v-show="hasData"
            cols="6"
          >
            <v-row>
              <v-col>
                <select-content-rating
                  @change="contentRatingSelected"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                tags here
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <similar-records
          v-show="filePicked"
          :records="similarRecords"
          :total="totalSimilarRecords"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-show="!fileUploaded && hasData"
          text
          @click.prevent="clearForm"
        >
          <v-icon left>
            fa-times
          </v-icon>

          Clear
        </v-btn>

        <v-spacer />

        <v-btn
          v-show="!fileUploaded && hasData"
          color="primary"
          :disabled="!valid"
          @click.prevent="createRecordAndStay"
        >
          <v-icon left>
            fa-upload
          </v-icon>

          Upload and Stay
        </v-btn>

        <v-btn
          v-show="!fileUploaded && hasData"
          color="primary"
          :disabled="!valid"
          @click.prevent="createRecordAndView"
        >
          <v-icon left>
            fa-external-link-alt
          </v-icon>

          Upload and View
        </v-btn>

        <v-btn
          v-show="fileUploaded"
          color="primary"
          nuxt
          :to="uploadedUrl"
        >
          <v-icon left>
            fa-location-arrow
          </v-icon>

          Go to record
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import byteSize from 'byte-size'
import SelectContentRating from '~/components/Content Rating/SelectContentRating.vue'
import SimilarRecords from '~/components/Record/SimilarRecords'
import ImageUtils from '~/assets/js/ImageUtils.js'

export default {
  name: 'UploadRecord',

  components: {
    SelectContentRating,
    SimilarRecords,
  },

  data: () => ({
    bigPreview: false,

    file: null,
    md5: null,
    phash: null,
    fileExtension: '',
    imagePreview: '',
    imageUrl: null,

    record: null,
    contentRating: null,
    showPreview: false,
    similarRecords: null,
    totalSimilarRecords: 0,

    fileUploaded: false,
    filePreProcessing: false,
    uploading: false,
    hasError: false,
    error: '',
    valid: false,

    imageUtils: null,
  }),

  computed: {
    ...mapGetters({
      get: 'config/get',
    }),

    hasData () {
      return this.filePicked || this.contentRating
    },

    previewCols () {
      return this.bigPreview ? 12 : 6
    },

    filePicked () {
      return !!this.file
    },

    uploadedUrl () {
      if (!this.record) { return '' }

      return '/records/' + this.record.id
    },

    maxImageSize () {
      return this.get('media.images.max_file_size')
    },

    maxFileSizeReadable () {
      return byteSize(this.maxImageSize, { units: 'iec' })
    },

    imageRules () {
      return [
        v => !!v || 'File is required',
        v => !v || v.size < this.maxImageSize || 'Images must be ' + this.maxFileSizeReadable + ' or smaller',
      ]
    },
  },

  created () {
    this.imageUtils = new ImageUtils()
  },

  beforeDestroy () {
    if (this.imageUtils) { this.imageUtils = null }
  },

  methods: {
    clearFileData () {
      this.imagePreview = ''
      this.md5 = null
      this.phash = null
      this.showPreview = false
      this.fileUploaded = false
      this.imageUrl = false
      this.similarRecords = null
    },

    pickedFile () {
      this.clearFileData()

      if (this.file) {
        this.$emit('file-picked')

        // if (/\.(jpe?g|png|gif)$/i.test(this.file.name) ) {
        this.filePreProcessing = true

        // const mime = this.file.type

        this.setPreview()

        this.filePreProcessing = false

        URL.revokeObjectURL(this.imageUrl)
        // }
      }
    },

    setPreview () {
      const reader = new FileReader()

      reader.addEventListener('load', function () {
        this.imageUrl = reader.result

        this.imagePreview = this.imageUrl

        this.showPreview = true

        this.calculateHash()
      }.bind(this), false)

      reader.readAsDataURL(this.file)
    },

    calculateHash () {
      this.imageUtils.getMD5(this.file)
        .then((result) => {
          this.md5 = result
        })
        .catch((error) => {
          console.error(error)
        })

      this.imageUtils.getPHash(this.file)
        .then((phash) => {
          this.phash = phash
          this.getSimilarRecords()
        })
    },

    createRecordAndStay () {
      this.doRecordUpload()
    },

    createRecordAndView () {
      this.doRecordUpload()
        .then(() => {
          this.$router.push({
            name: 'records-id',
            params: { id: this.record.id }
          })
        })
    },

    doRecordUpload () {
      return new Promise((resolve, reject) => {
        this.createRecord()
          .then(() => {
            this.uploadFile()
              .then((result) => {
                resolve(result)
              })
              .catch((error) => {
                reject(error)
              })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    createRecord () {
      this.uploading = true
      this.$emit('creating')

      const mutation = gql`mutation(
          $md5: String!
          $record_type_id: Int!
          $content_rating_id: Int!
        ){
          createRecord(
            md5: $md5
            record_type_id: $record_type_id
            content_rating_id: $content_rating_id
          ){
            id
            md5
            title
            record_type_id
            content_rating{
              id
              name
              short_name
            }
          }
        }`
      const variables = {
        md5: this.md5,
        record_type_id: 1,
        content_rating_id: this.contentRating.id,
      }

      return new Promise((resolve, reject) => {
        this.$apollo.mutate({ mutation, variables })
          .then((result) => {
            this.$emit('created')

            this.record = result.data.createRecord

            resolve(result)
          }).catch((error) => {
            this.$emit('error')
            console.error(error)

            this.hasError = true
            this.uploading = false

            this.error = 'Failed to create record'

            reject(error)
          })
      })
    },

    uploadFile () {
      this.$emit('uploading')

      const mutation = gql`mutation(
          $id: ID!
          $file: Upload!
        ){
          upload(
            id: $id
            file: $file
          )
        }`
      const variables = {
        id: this.record.id,
        file: this.file,
      }

      return new Promise((resolve, reject) => {
        this.$apollo.mutate({ mutation, variables })
          .then((result) => {
            this.fileUploaded = true

            this.uploading = false

            this.$emit('uploaded')

            resolve(result)
          }).catch((error) => {
            this.$emit('error')
            console.error(error)

            this.hasError = true
            this.uploading = false

            this.error = 'Failed to upload file'

            reject(error)
          })
      })
    },

    getSimilarRecords () {
      const query = gql`query(
          $phash: String!
        ){
          similarRecords(
            phash: $phash
          ){
            data{
              id
              thumbnail
            }
            paginatorInfo{
              total
            }
          }
        }`

      const variables = {
        phash: '' + this.phash,
      }

      this.$apollo.query({ query, variables })
        .then(({ data }) => {
          this.similarRecords = data.similarRecords.data
          this.totalSimilarRecords = data.similarRecords.paginatorInfo.total
        }).catch((error) => {
          console.error(error)
        })
    },

    contentRatingSelected (contentRating) {
      this.contentRating = contentRating
    },

    clearForm () {
      this.$refs.uploadForm.reset()
      this.clearFileData()
    },
  },
}
</script>

<style scoped>
.preview-image{
  max-width: 100%;
  max-height: 450px;
  transition-property: all;
  transition-duration: 0.2s;
  cursor: zoom-in;
}

  .preview-image >>> .v-image__image
  {
    background-position: center left !important;
  }

.preview-image.expanded{
  max-height:80vh;
  cursor: zoom-out;
}

  .preview-image.expanded >>> .v-image__image
  {
    background-position: center center !important;
  }

.preview-col{
  transition-property: all;
  transition-duration: 0.2s;
}
</style>
