<template>
  <div>
    <v-autocomplete
      v-model="query"
      :items="foundTags"
      :loading="isLoading"
      :search-input.sync="tagSearch"
      color="white"
      hide-no-data
      cache-items
      multiple
      chips
      item-text="name"
      item-value="id"
      label="Search tags"
      prepend-icon="fa-tag"
      return-object
      @change="changed"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'SearchBar',

  props: [
    'initialQuery',
  ],

  data: () => ({
    query: {},
    foundTags: [],
    isLoading: false,
    tagSearch: null,
  }),

  computed: {
    realQuery () {
      if (!this.query) { return '' }

      // return this.query.split(' ').map((item) => { return '[' + item.replace('_', ' ') + ']' }).join(' ')
      return this.query.map((term) => { return '[' + term.name + ']' }).join(' ')
    }
  },

  watch: {
    tagSearch (val) {
      val && this.searchTags(val)
    },
  },

  created () {
    this.query = JSON.parse(JSON.stringify(this.initialQuery))
  },

  methods: {
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

    filterTags (item, queryText, itemText) {
      return itemText.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) &&
        !(this.query && this.query.find(f => f.name === itemText))
    },

    changed () {
      this.$emit('change', this.realQuery)
    }
  },
}
</script>

<style scoped>

</style>
