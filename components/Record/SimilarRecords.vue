<template>
  <v-card
    v-if="recordsToDisplay.length"
  >
    <card-header
      title="Similar Records"
      :count="totalToDisplay"
    >
      <template v-slot:action>
        <v-btn
          text
          nuxt
          exact
          :to="'/records?query='"
        >
          View all
        </v-btn>
      </template>
    </card-header>

    <v-card-text>
      <thumbnail-slider
        :records="recordsToDisplay"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
import Thumbnail from '~/components/Record/Thumbnail.vue'
import ThumbnailSlider from '~/components/Record/ThumbnailSlider.vue'
import CardHeader from "~/components/CardHeader";

export default {
  name: 'SimilarRecords',

  components:{
    Thumbnail,
    ThumbnailSlider,
    CardHeader,
  },

  props: [
    'similarToRecord',
    'records',
    'total',
  ],

  data:() => ({
    similarRecords: [],
    totalSimilar: 0,
  }),

  watch:{
    similarToRecord(val){
      this.getSimilarRecords()
    },
  },

  computed:{
    recordsToDisplay(){
      if(this.records)
        return this.records

      return this.similarRecords
    },

    totalToDisplay(){
      if(this.total)
        return this.total

      return this.totalSimilar
    }
  },

  methods: {
    async getSimilarRecords(){
      const query = gql`query($id: ID!){
        similarRecords(id: $id){
          data{
            id
            thumbnail
            distance
          }
          paginatorInfo{
            total
          }
        }
      }`

      const variables = { 
        id: this.similarToRecord.id
      }

      return this.$apollo.query({query, variables})
        .then(({ data }) => {
          this.similarRecords = data.similarRecords.data
          this.totalSimilar = data.similarRecords.paginatorInfo.total
        })
    },
  },
}
</script>

<style scoped>

</style>