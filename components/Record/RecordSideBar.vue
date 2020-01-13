<template>
  <v-navigation-drawer
    class="sidebar"
    v-model="$store.state.drawer.drawerOpen"
    clipped
    app
    :stateless="true"
    :width="300"
  >
    <v-btn 
      color="primary" 
      @click.prevent="getFullRes"
      @mousedown="doPreloadFullRes"
      v-if="record.preview && showPreview"
      block
      class="mb-2"
    >
      <v-icon left>
        fa-expand
      </v-icon>
      Get full resolution
    </v-btn>

    <v-btn 
      color="secondary" 
      @click.prevent="download"
      block
      class="mb-2"
    >
      <v-icon left>
        fa-download
      </v-icon>
      Download
    </v-btn>

    <v-btn 
      color="primary" 
      @click.prevent="edit"
      block
      v-show="!isEdit && userHasPermission('record.update own')"
      class="mb-2"
    >
      <v-icon left>
        fa-edit
      </v-icon>
      Edit
    </v-btn>

    <v-btn 
      color="primary" 
      @click.prevent="save"
      v-show="isEdit"
    >
      <v-icon left>
        fa-save
      </v-icon>
      Save
    </v-btn>

    <v-btn 
      color="secondary" 
      @click.prevent="cancel"
      v-show="isEdit"
    >
      <v-icon left>
        fa-times
      </v-icon>
      Cancel
    </v-btn>

    <SectionHeader
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
    </SectionHeader>

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
      @change="addTag"
      return-object
      :filter="filterTags"
      :disabled="isSaving"
    ></v-autocomplete>

    <div
      v-if="displayTags.length"
    >
      <div
        v-for="(tag, index) in displayTags"
        :key="tag.id"
      >
        <TagChip 
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
      <v-icon left small>fa-exclamation-triangle</v-icon>
      No tags found
    </div>

    <SectionHeader
      class="mt-10 mb-5"
    >
      <span class="title">
        Metadata
      </span>
    </SectionHeader>

    <v-icon left small>fa-eye-slash</v-icon> Content Rating
    <br>
    <kbd
      class="subtitle-1 mt-2"
      v-text="record.content_rating.name"
      v-if="!isEdit"
    ></kbd>
    <SelectContentRating
      v-else
      :contentRating="record.content_rating"
      @change="(selected) => { editableRecord.content_rating = selected }"
    />
    <br>
    <br>
    <v-icon left small>fa-gavel</v-icon> Approved
    <br>
    <kbd
      class="subtitle-1 mt-2"
      v-text="record.approved ? 'Yes' : 'Awaiting Approval'"
    ></kbd>
    <br>
    <br>
    <v-icon left small>fa-fingerprint</v-icon> MD5
    <br>
    <kbd
      class="subtitle-1 mt-2"
      v-text="record.md5"
    ></kbd>
    <br>
    <br>
    <v-icon left small>fa-barcode</v-icon> pHash
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
            v-text="record.phash"
            v-on="on"
          ></kbd>
        </nuxt-link>
      </template>
      <div style="max-width:200px">pHashes can be compared to find images that look similar. Click to try it...</div>
    </v-tooltip>
    <br>
    <br>
    <v-icon left small>fa-calendar-alt</v-icon> Created
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.created_at"
    ></kbd>
    <br>
    <br>
    <v-icon left small>fa-user</v-icon> Created By
    <br>
    <nuxt-link
      :to="'/users/' + record.created_by.id"
    >
      <kbd
        class="subtitle-1 mt-2 text-truncate"
        v-text="record.created_by.username"
      ></kbd>
    </nuxt-link>
    <br>
    <br>
    <v-icon left small>fa-calendar-alt</v-icon> Modified
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.updated_at"
    ></kbd>
    <br>
    <br>
    <v-icon left small>fa-user</v-icon> Modified By
    <br>
    <kbd
      class="subtitle-1 mt-2 text-truncate"
      v-text="record.updated_by.username"
    ></kbd>
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

  props:[
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

  watch: {
    search (val) {
      val && val !== this.selectedTag && this.searchTags(val)
    },
  },

  computed: {
    ...mapGetters({
      userHasPermission: 'auth/userHasPermission',
    }),

    displayTags(){
      return this.isEdit ? this.editableRecord.tags : this.record.tags
    },
  },

  methods: {
    edit(){
      this.isEdit = true
      this.editableRecord = JSON.parse(JSON.stringify(this.record))
    },

    cancel(){
      this.isEdit = false
      this.editableRecord = {}
    },

    async save(){
      this.$emit('saving')
      this.isSaving = true

      await this.updateRecord()
      await this.syncRecordTags()

      this.isEdit = false
      
      this.editableRecord = {}

      this.isSaving = false
      this.$emit('saved')
    },

    async updateRecord(){
      const mutation = gql`mutation($id: ID!, $content_rating_id: Int){
        updateRecord(id: $id, content_rating_id: $content_rating_id){
          id
        }
      }`

      const variables = {
        id: this.record.id,
        content_rating_id: this.editableRecord.content_rating.id,
      }

      return this.$apollo.mutate({mutation, variables})
    },

    async syncRecordTags(){
      const mutation = gql`mutation($record_id: ID!, $tag_ids: [ID!]!){
        syncRecordTags(record_id: $record_id, tag_ids: $tag_ids){
          id
        }
      }`

      const variables = {
        record_id: this.record.id,
        tag_ids: this.editableRecord.tags.map(f => f.id),
      }

      return this.$apollo.mutate({mutation, variables})
    },

    filterTags(item, queryText, itemText){
      return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 &&
        !this.editableRecord.tags.find(f => f.name === itemText)
    },

    removeTag(tagIndex){
      this.editableRecord.tags.splice(tagIndex, 1)
    },

    addTag(){
      if(this.selectedTag)
        this.editableRecord.tags.push({...this.selectedTag, isNew: true})

      this.$nextTick(() => {
        this.selectedTag = ''
        this.search = null
      })
    },
    
    searchTags(v) {
      this.isLoading = true

      const query = gql`query($name: Mixed){
        tags(where: { AND:[
          { column: NAME, operator: LIKE, value: $name }
        ]}){
          data {
            id
            name
            description
            cache_record_count
          }
        }
      }`

      const variables = {
        name: v + '%',
      }

      this.$apollo.query({query, variables})
        .then(({ data }) => {
          this.foundTags = data.tags.data

          this.isLoading = false
        })
    },

    download(){
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

    getFullRes(){
      this.showPreview = false

      this.$emit('get-full-res')
    },

    doPreloadFullRes(){
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