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
    @change="selectionChanged"
  />
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'SelectContentRating',

  props: [
    'contentRating',
  ],

  data: function() {
    return {
      myContentRating: null,
      contentRatings: null,
    }
  },
  
  created: function () {
    this.getContentRatings()

    this.myContentRating = this.contentRating
  },

  computed: {
    description(){
      if(!this.myContentRating)
        return ''

      return this.myContentRating.description
    },
  },

  methods:{
    selectionChanged(){
      this.$emit('change', this.myContentRating)
    },

    getContentRatings(){
      const query = gql`query{
        contentRatings {
          id
          name
          short_name
          description
        }
      }`

      this.$apollo.query({query})
        .then(({ data }) => {
          this.contentRatings = data.contentRatings
        }).catch((error) => {
          this.$emit('error')
        })
    },
  },
}
</script>