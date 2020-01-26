<template>
  <div>
    <record-side-bar
      :record="record"
      @saved="saved"
      @get-full-res="showPreview = false"
      @preload-full-res="preloadFullRes = true"
    />

    <record-media
      :show-preview="showPreview"
      :record="record"
      :preload-full-res="preloadFullRes"
    />

    <similar-records
      :similar-to-record="record"
      class="mt-7"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapMutations } from 'vuex'
import RecordMedia from '~/components/Record/RecordMedia'
import SimilarRecords from '~/components/Record/SimilarRecords'
import RecordSideBar from '~/components/Record/RecordSideBar'

export default {
  components: {
    RecordMedia,
    SimilarRecords,
    RecordSideBar,
  },

  data: () => ({
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

  created () {
    this.getRecord()
    this.setPageHasDrawer({ value: this.$route.name })
  },

  methods: {
    ...mapMutations({
      setPageHasDrawer: 'drawer/setPageHasDrawer',
    }),

    async saved () {
      await this.getRecord(true)
    },

    getRecord (forceUpdate) {
      const isId = !isNaN(this.$route.params.id)

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
            summary
            records_count
          }
        }
      }`

      const variables = { }
      if (isId) { variables.id = this.$route.params.id } else { variables.md5 = this.$route.params.id }

      this.$apollo.query({ query, variables, fetchPolicy: forceUpdate ? 'network-only' : null })
        .then(({ data }) => {
          this.record = data.record
        })
    },
  },
}
</script>

<style scoped>
</style>
