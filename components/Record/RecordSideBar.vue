<template>
  <v-navigation-drawer
    v-model="$store.state.drawer.drawerOpen"
    class="sidebar"
    clipped
    app
    :stateless="true"
    :width="300"
  >
    <v-btn
      v-if="record.preview && showPreview"
      color="primary"
      block
      class="mb-2"
      @click.prevent="getFullRes"
      @mousedown="doPreloadFullRes"
    >
      <v-icon left>
        fa-expand
      </v-icon>
      Get full resolution
    </v-btn>

    <v-btn
      color="secondary"
      block
      class="mb-2"
      @click.prevent="download"
    >
      <v-icon left>
        fa-download
      </v-icon>
      Download
    </v-btn>

    <v-btn
      v-show="!isEdit && userHasPermission('record.update own')"
      color="primary"
      block
      class="mb-2"
      @click.prevent="edit"
    >
      <v-icon left>
        fa-edit
      </v-icon>
      Edit
    </v-btn>

    <v-btn
      v-show="isEdit"
      color="primary"
      @click.prevent="save"
    >
      <v-icon left>
        fa-save
      </v-icon>
      Save
    </v-btn>

    <v-btn
      v-show="isEdit"
      color="secondary"
      @click.prevent="cancel"
    >
      <v-icon left>
        fa-times
      </v-icon>
      Cancel
    </v-btn>

    <section-header
      class="mt-10 mb-5"
    >
      <span class="title">
        Tags
        <span
          v-show="displayTags.length"
          class="subtitle-1"
        >
          ({{ displayTags.length }})
        </span>
      </span>
    </section-header>

    <v-autocomplete
      v-if="isEdit"
      v-model="selectedTag"
      :items="foundTags"
      :loading="isLoading"
      :search-input.sync="search"
      color="white"
      hide-no-data
      cache-items
      item-text="name"
      item-value="id"
      label="Search tags"
      prepend-icon="fa-tag"
      return-object
      :filter="filterTags"
      :disabled="isSaving"
      @change="addTag"
    />

    <div
      v-if="displayTags.length"
    >
      <div
        v-for="(tag, index) in displayTags"
        :key="tag.id"
      >
        <tag-chip
          :tag="tag"
          :editable="isEdit"
          :disabled="isSaving"
          @close="removeTag(index)"
        />
      </div>
    </div>
    <div
      v-else
      class="subtitle-2"
    >
      <v-icon
        left
        small
      >
        fa-exclamation-triangle
      </v-icon>
      No tags found
    </div>

    <section-header
      class="mt-10 mb-5"
    >
      <span class="title">
        Metadata
      </span>
    </section-header>

    <v-icon
      left
      small
    >
      fa-eye-slash
    </v-icon> Content Rating
    <br>
    <kbd
      v-if="!isEdit"
      class="subtitle-1 mt-2"
      v-text="record.content_rating.name"
    />
    <select-content-rating
      v-else
      :content-rating="record.content_rating"
      @change="(selected) => { editableRecord.content_rating = selected }"
    />
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-gavel
    </v-icon> Approved
    <br>
    <kbd
      class="subtitle-1 mt-2"
      v-text="record.approved ? 'Yes' : 'Awaiting Approval'"
    />
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-fingerprint
    </v-icon> MD5
    <br>
    <kbd
      class="subtitle-1 mt-2"
      v-text="record.md5"
    />
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-barcode
    </v-icon> pHash
    <br>
    <v-tooltip bottom>
      <template
        v-slot:activator="{ on }"
      >
        <nuxt-link
          :to="'/records?query=distance:' + record.id + ':10'"
        >
          <kbd
            class="subtitle-1 mt-2"
            v-on="on"
            v-text="record.phash"
          />
        </nuxt-link>
      </template>
      <div style="max-width:200px">
        pHashes can be compared to find images that look similar. Click to try it...
      </div>
    </v-tooltip>
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-calendar-alt
    </v-icon> Created
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.created_at"
    />
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-user
    </v-icon> Created By
    <br>
    <nuxt-link
      :to="'/users/' + record.created_by.id"
    >
      <kbd
        class="subtitle-1 mt-2 text-truncate"
        v-text="record.created_by.username"
      />
    </nuxt-link>
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-calendar-alt
    </v-icon> Modified
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.updated_at"
    />
    <br>
    <br>
    <v-icon
      left
      small
    >
      fa-user
    </v-icon> Modified By
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.updated_by.username"
    />

    <br>
    <br>

    <v-btn
      color="error"
      block
    >
      <v-icon left>
        fa-flag
      </v-icon>
      Report
    </v-btn>
  </v-navigation-drawer>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import SelectContentRating from '~/components/Content Rating/SelectContentRating'
import TagChip from '~/components/Tag/TagChip'
import SectionHeader from '~/components/SectionHeader'

export default {
  name: 'RecordSideBar',

  components: {
    SelectContentRating,
    TagChip,
    SectionHeader,
  },

  props: [
    'record',
  ],

  data: () => ({
    showPreview: true,
    preloadFullRes: false,

    foundTags: [],
    isLoading: false,
    selectedTag: null,
    search: null,

    isEdit: false,
    isSaving: false,

    editableRecord: {},
  }),

  computed: {
    ...mapGetters({
      userHasPermission: 'auth/userHasPermission',
    }),

    displayTags () {
      return this.isEdit ? this.editableRecord.tags : this.record.tags
    },
  },

  watch: {
    search (val) {
      val && val !== this.selectedTag && this.searchTags(val)
    },
  },

  methods: {
    edit () {
      this.isEdit = true
      this.editableRecord = JSON.parse(JSON.stringify(this.record))
    },

    cancel () {
      this.isEdit = false
      this.editableRecord = {}
    },

    async save () {
      this.$emit('saving')
      this.isSaving = true

      await this.updateRecord()
      await this.syncRecordTags()

      this.isEdit = false

      this.editableRecord = {}

      this.isSaving = false
      this.$emit('saved')
    },

    async updateRecord () {
      const mutation = gql`mutation($id: ID!, $content_rating_id: Int){
        updateRecord(id: $id, content_rating_id: $content_rating_id){
          id
        }
      }`

      const variables = {
        id: this.record.id,
        content_rating_id: this.editableRecord.content_rating.id,
      }

      await this.$apollo.mutate({ mutation, variables })
    },

    async syncRecordTags () {
      const mutation = gql`mutation($record_id: ID!, $tag_ids: [ID!]!){
        syncRecordTags(record_id: $record_id, tag_ids: $tag_ids){
          id
        }
      }`

      const variables = {
        record_id: this.record.id,
        tag_ids: this.editableRecord.tags.map(f => f.id),
      }

      await this.$apollo.mutate({ mutation, variables })
    },

    filterTags (item, queryText, itemText) {
      return itemText.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) &&
        !this.editableRecord.tags.find(f => f.name === itemText)
    },

    removeTag (tagIndex) {
      this.editableRecord.tags.splice(tagIndex, 1)
    },

    addTag () {
      if (this.selectedTag) { this.editableRecord.tags.push({ ...this.selectedTag, isNew: true }) }

      this.$nextTick(() => {
        this.selectedTag = ''
        this.search = null
      })
    },

    searchTags (v) {
      this.isLoading = true

      const query = gql`query($name: Mixed){
        tags(where: { AND:[
          { column: NAME, operator: LIKE, value: $name }
        ]}){
          data {
            id
            name
            description
            records_count
          }
        }
      }`

      const variables = {
        name: v + '%',
      }

      this.$apollo.query({ query, variables })
        .then(({ data }) => {
          this.foundTags = data.tags.data

          this.isLoading = false
        })
    },

    download () {
      const url = this.record.image
      const filename = this.record.md5 + '.png'

      this.$axios.$get(url, { responseType: 'blob' })
        .then(({ data }) => {
          const blob = new Blob([data], { type: 'image/png' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = filename
          link.click()
          URL.revokeObjectURL(link.href)
        }).catch(error => console.error(error))
    },

    getFullRes () {
      console.log('here')

      this.showPreview = false

      this.$emit('get-full-res')
    },

    doPreloadFullRes () {
      this.preloadFullRes = true

      this.$emit('preload-full-res')
    }
  }
}
</script>

<style scoped>
  kbd{
    max-width:100%;
    word-break: break-all;
  }

  .v-chip--active{
    background-color:rgb(36, 70, 51);
  }

  .sidebar >>> .v-navigation-drawer__content{
    padding:10px;
  }
</style>
