<template>
  <v-card 
    class="file-upload-container mb-5"
    :loading="uploading"
  >
    <v-card-title>
      <v-file-input 
          accept="image/*" 
          label="Select media"
          v-model="file"
          @change="pickedFile"
          show-size
          prepend-icon="fa-folder-open"
          v-show="!fileUploaded"
          :loading="filePreProcessing"
          :success="fileUploaded"
          :error="hasError"
          :error-messages="error"
          single-line
          dense
      ></v-file-input>
      <span
        v-if="fileUploaded"
      >
        {{ this.record.md5 }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-img 
            :src="imagePreview" 
            v-show="showPreview"
            max-width="300"
            max-height="300"
            contain
            position="top left"
          ></v-img>
        </v-col>
        <v-spacer />
        <v-col cols="6" v-show="showPreview">
          <v-row>
            <v-col>
              <SelectContentRating
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

      <SimilarRecords
        :records="similarRecords"
        :total="totalSimilarRecords"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn 
        color="primary" 
        @click.prevent="createRecordAndStay"
        v-show="!fileUploaded && filePicked"
      >
        <v-icon left>
          fa-upload
        </v-icon>
        
        Upload and Stay
      </v-btn>

      <v-btn 
        color="primary" 
        @click.prevent="createRecordAndView"
        v-show="!fileUploaded && filePicked"
      >
        <v-icon left>
          fa-external-link-alt
        </v-icon>
        
        Upload and View
      </v-btn>

      <v-btn 
        color="primary" 
        nuxt 
        :to="uploadedUrl"
        v-show="fileUploaded"
      >
        <v-icon left>
          fa-location-arrow
        </v-icon>

        Go to record
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import gql from 'graphql-tag'
import SelectContentRating from '~/components/Content Rating/SelectContentRating.vue'
import ImageUtils from '~/assets/ImageUtils.js'
import SimilarRecords from '~/components/Record/SimilarRecords'

export default {
  name: "UploadRecord",

  components: {
    SelectContentRating,
    SimilarRecords,
  },

  data: function() {
    return {
      file: null,
      md5: null,
      phash: null,
      fileExtension: '',
      imagePreview: '',


      imageUrl: null,

      record: null,
      contentRating: null,
      showPreview:false,
      similarRecords: null,
      totalSimilarRecords: 0,

      fileUploaded: false,
      filePreProcessing: false,
      uploading: false,
      hasError: false,
      error: '',

      imageUtils: null,
    }
  },
  
  created(){
    this.imageUtils = new ImageUtils()
  },

  beforeDestroy(){
    if(this.imageUtils)
      this.imageUtils = null
  },

  computed: {
    filePicked(){
      return this.file !== null
    },

    uploadedUrl(){
      if(!this.record)
        return ''

      return '/records/' + this.record.id
    },
  },

  methods:{
    pickedFile(){
      this.imagePreview = ''
      this.md5 = null
      this.phash = null
      this.showPreview = false
      this.fileUploaded = false

      if(this.file){
        this.$emit('file-picked')

        //if (/\.(jpe?g|png|gif)$/i.test(this.file.name) ) {
          this.filePreProcessing = true

          const mime = this.file.type

          this.setPreview()

          this.filePreProcessing = false

          URL.revokeObjectURL(this.imageUrl)
        //}
      }
    },

    setPreview(){
      let reader  = new FileReader()

      reader.addEventListener("load", function () {
        this.imageUrl = reader.result

        this.imagePreview = this.imageUrl

        this.showPreview = true

        this.calculateHash()

      }.bind(this), false)
          
      reader.readAsDataURL(this.file)
    },

    calculateHash() {
      this.imageUtils.getMD5(this.file)
        .then(
          res => this.md5 = res,
          err => console.error(err)
        )

      this.imageUtils.getPHash(this.file)
        .then((phash) => {
          this.phash = phash
          this.getSimilarRecords()
        })
    },

    createRecordAndStay(){
      this.doRecordUpload()
        .then(() => {

        })
    },

    createRecordAndView(){
      this.doRecordUpload()
        .then(() => {
          this.$router.push({ name: 'records-id', params: { id: this.record.id } })  
        })
    },

    async doRecordUpload(){
      return this.createRecord()
      .then(() => {
        this.uploadFile()
      })
    },

    async createRecord(){
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

      return this.$apollo.mutate({mutation, variables})
        .then(({ data }) => {
          this.$emit('created')

          this.record = data.createRecord
        }).catch((error) => {
          this.$emit('error')

          this.hasError = true
          this.uploading = false

          this.error = 'Failed to create record'
        })
    },

    async uploadFile(){
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

      return this.$apollo.mutate({mutation, variables})
        .then(({ data }) => {
          this.fileUploaded = true

          this.uploading = false

          this.$emit('uploaded')
        }).catch((error) => {
          this.$emit('error')

          this.hasError = true
          this.uploading = false

          this.error = 'Failed to upload file'
        })
    },

    async getSimilarRecords(){
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

      return this.$apollo.query({query, variables})
        .then(({ data }) => {
          this.similarRecords = data.similarRecords.data
          this.totalSimilarRecords = data.similarRecords.paginatorInfo.total
        }).catch((error) => {
          
        })
    },

    contentRatingSelected(contentRating){
      this.contentRating = contentRating
    }
  },
}
</script>






<style scoped>
</style>
