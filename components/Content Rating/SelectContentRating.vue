<template>
  <v-select
    v-model="myContentRating"
    :hint="description"
    :items="contentRatings"
    item-text="name"
    item-value="id"
    label="Content Rating"
    persistent-hint
    return-object
    required
    :rules="[v => !!v || 'Content rating is required']"
    @change="selectionChanged"
  />
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'SelectContentRating',

  props: ['contentRating'],

  data () {
    return {
      myContentRating: null,
      contentRatings: null,
    }
  },

  computed: {
    description () {
      if (!this.myContentRating) { return '' }

      return this.myContentRating.description
    },
  },

  watch: {
    myContentRating () {
      this.selectionChanged()
    },
  },

  created () {
    this.getContentRatings()

    this.myContentRating = this.contentRating
  },

  methods: {
    selectionChanged () {
      this.$emit('change', this.myContentRating)
    },

    getContentRatings () {
      const query = gql`
        query {
          contentRatings {
            id
            name
            short_name
            description
          }
        }
      `

      this.$apollo
        .query({ query })
        .then(({ data }) => {
          this.contentRatings = data.contentRatings
        })
        .catch((error) => {
          this.$emit('error', error)
        })
    },
  },
}
</script>
