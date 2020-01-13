<template>
  <v-container>
    <v-card>
      <v-card-title>
        Tags
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="tags"
        :options.sync="options"
        :server-items-length="totalTags"
        :loading="loading"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
      >
        <template v-slot:item.name="props">
          <v-chip
            nuxt
            :to="'/tags/' + props.item.id"
          >
            {{ props.item.name }}
          </v-chip>
        </template>
      </v-data-table>

      <v-divider />

      <v-card-actions
        class="mt-6"
      >
        <div>
          <v-pagination 
            v-model="page" 
            :length="pageCount"
          />
        </div>

        <v-spacer />

        <div>
          <v-select
            v-model="itemsPerPage"
            label="Items per page"
            :items="[10, 20, 30, 40, 50]"
            @change="getTags"
          />
        </div>
        
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data: function() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      tags: [],
      totalTags: 0,
      loading: true,
      options: {},
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
        },
        { text: 'Records', value: 'cache_record_count' },
        { text: 'Aliased To', value: 'aliased_to_tag.name' },
      ],
    }
  },
  
  mounted: function () {
    if(this.$route.query.page)
      this.page = parseInt(this.$route.query.page)

    this.getTags()
  },

  computed: {
    visiblePages(){
      return Math.max(this.numberOfPages, 10)
    },
  },

  watch: {
    page() {
      history.pushState(
        {},
        null,
        '/tags?page=' + this.page
      )

      this.getTags()
    },

    options: {
      handler () {
        this.getTags()
      },
      deep: true,
    },
  },

  methods:{
    getTags(){
      this.loading = true

      const { sortBy, sortDesc } = this.options

      const query = gql`query($page: Int!, $perPage: Int!, $orderBy: String!, $orderDir: SortOrder!){
        tags(
          page: $page
          first: $perPage
          orderBy: [{field: $orderBy, order: $orderDir}]
        ){
          data{
            id
            name
            aliased_to_tag {
              id
              name
            }
            cache_record_count
            cache_folder_count
          }
          paginatorInfo {
            total
            count
            currentPage
            hasMorePages
          }
        }
      }`
      const variables = {
        page: this.page,
        perPage: this.itemsPerPage,
        orderBy: sortBy.length ? sortBy[0] : 'id',
        orderDir: sortDesc.length ? (sortDesc[0] ? 'DESC' : 'ASC') : 'ASC',
      }

      return this.$apollo.query({query, variables, fetchPolicy: 'network-only'})
        .then(({ data }) => {
          this.tags = data.tags.data

          this.totalTags = data.tags.paginatorInfo.total;

          this.loading = false
        })
    },

    url(id){
      return '/tag/' + id
    }
  },
}
</script>

<style scoped>

</style>
