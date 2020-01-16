<template>
  <div>
      <record-side-bar
        :record="record"
        @saved="saved"
        @get-full-res="showPreview = false"
        @preload-full-res="preloadFullRes = true"
      />

      <record-media 
        :showPreview="showPreview"
        :record="record"
        :preloadFullRes="preloadFullRes"
      />

      <similar-records 
        :similarToRecord="record"
        class="mt-7"
      />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RecordMedia from '~/components/Record/RecordMedia'
import SimilarRecords from '~/components/Record/SimilarRecords'
import RecordSideBar from '~/components/Record/RecordSideBar'

export default {
  components:{
    RecordMedia,
    SimilarRecords,
    RecordSideBar,
  },

  data:() => ({
    record: {
      content_rating: {}, 
      created_by: {},
      updated_by: {},
      deleted_by: {},
      tags: [],
    },

    showPreview: true,
    preloadFullRes: false,
  }),
  
  created: function () {
    this.getRecord()
  },

  methods:{ 
    async saved(){
      await this.getRecord(true)
    },

    async getRecord(forceUpdate){
      const isId = !isNaN(this.$route.params.id);

      const query = gql`query($id: ID, $md5: String){
        record(id: $id, md5: $md5){
          id
          md5
          phash
          image
          preview
          thumbnail
          content_rating{
            id
            name
            description
          }
          approved
          created_at
          updated_at
          deleted_at
          created_by{
            id
            username
          }
          updated_by{
            id
            username
          }
          deleted_by{
            id
            username
          }
          tags{
            id
            name
            description
            records_count
          }
        }
      }`

      const variables = { }
      if(isId)
        variables.id = this.$route.params.id
      else
        variables.md5 = this.$route.params.id

      return this.$apollo.query({query, variables, fetchPolicy: forceUpdate ? 'network-only' : null})
        .then(({ data }) => {
          this.record = data.record
        })
    },
  },
}
</script>

<style scoped>
</style>
