<template>
  <v-container>
    <SideBar 
    />
    
    <v-row>
      <v-col>
        <div
          v-show="numberOfPages > 0"
          class="thumbnail-container"
        >
          <Thumbnail 
            v-for="record in records" 
            :key="record.id"
            :record="record"
            :size="thumbnailSize"
          />
        </div>

        <v-banner
          v-if="records && records.length == 0"
          class="headline"
        >
          <v-avatar
            slot="icon"
            size="40"
          >
            <v-icon>fa-info-circle</v-icon>
          </v-avatar>
          No records found
        </v-banner>

        <v-pagination
          v-model="page"
          :length="numberOfPages"
          :page="page"
          :total-visible="visiblePages"
          v-show="numberOfPages > 1"
          class="mt-5"
      ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import Thumbnail from '~/components/Record/Thumbnail.vue'
import searchRecordsQuery from '~/graphql/record/searchRecords.gql'
import SearchBar from '~/components/Record/SearchBar.vue'
import SideBar from '~/components/Record/IndexSideBar.vue'

export default {
  components:{
    Thumbnail,
    SearchBar,
    SideBar,
  },

  data: function() {
    return {
      records: null,
      page: parseInt(this.$route.query.page) || 1,
      numberOfPages: 0,
      perPage: 20,
      thumbnailSize: 200,
      query: null,//this.$route.query.query || '',
    }
  },
  
  mounted: function () {
    this.getRecords()
  },

  computed: {
    visiblePages(){
      return Math.max(this.numberOfPages, 10)
    },
  },

  watch: {
    page() {
      this.pushPageState()

      this.getRecords()
    },
  },

  methods:{
    pushPageState(){
      history.pushState(
        {},
        null,
        '/records?page=' + this.page //+ '&query=' + this.query
      )
    },

    imageLoaded(index){
      return this.records 
        && this.records[index]
        && this.records[index].loaded
    },

    search(){
      this.pushPageState()

      this.getRecords()
    },

    getRecords(){
      const variables = {
        query: this.query,
        page: this.page,
        perPage: this.perPage,
      }

      this.$apollo.query({query: searchRecordsQuery, variables, fetchPolicy: 'network-only'})
        .then(({ data }) => {
          this.records = data.searchRecords.data

          this.numberOfPages = Math.ceil(data.searchRecords.paginatorInfo.total / this.perPage);
        })
    },

    updateQuery(val){
      this.query = val
    }
  },
}
</script>

<style scoped>
.thumbnail-container{
  display:flex;
  flex-wrap: wrap;
  justify-content:space-around;
  align-items:center;
}
</style>
