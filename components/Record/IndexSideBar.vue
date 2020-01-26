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
  </v-navigation-drawer>
</template>

<script>
import gql from 'graphql-tag'
import TagChip from '~/components/Tag/TagChip'
import SectionHeader from '~/components/SectionHeader'

export default {
  name: 'IndexSideBar',

  components: {
    TagChip,
    SectionHeader,
  },

  props: [
  ],

  data: () => ({
    foundTags: [],
    isLoading: false,
    selectedTag: null,
    search: null,
  }),

  computed: {
    displayTags () {
      return []// this.isEdit ? this.editableRecord.tags : this.record.tags
    },
  },

  watch: {
    search (val) {
      val && val !== this.selectedTag && this.searchTags(val)
    },
  },

  methods: {
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
            cache_record_count
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
