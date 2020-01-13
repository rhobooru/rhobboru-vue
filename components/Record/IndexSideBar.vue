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
      block
    >
      <v-icon left>
        fa-search
      </v-icon>
      Search
    </v-btn>

    <v-btn
      block
      class="mt-2"
    >
      <v-icon left>
        fa-times
      </v-icon>
      Clear
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
  </v-navigation-drawer>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import SelectContentRating from '~/components/Content Rating/SelectContentRating'
import TagChip from '~/components/Tag/TagChip'
import SectionHeader from '~/components/SectionHeader'

export default {
  name: 'IndexSideBar',

  components: {
    SelectContentRating,
    TagChip,
    SectionHeader,
  },

  props:[
  ],

  data: () => ({
    foundTags: [],
    isLoading: false,
    selectedTag: null,
    search: null,
  }),

  watch: {
    search (val) {
      val && val !== this.selectedTag && this.searchTags(val)
    },
  },

  computed: {
    displayTags(){
      return [];//this.isEdit ? this.editableRecord.tags : this.record.tags
    },
  },

  methods: {
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
  }
}
</script>

<style scoped>
  .v-chip--active{
    background-color:rgb(36, 70, 51);
  }

  .sidebar >>> .v-navigation-drawer__content{
    padding:10px;
  }
</style>