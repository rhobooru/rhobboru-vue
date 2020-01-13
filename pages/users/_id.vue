<template>

  <v-container>

    <v-card>
       <v-list-item>
        <v-list-item-avatar 
          color="grey"
          :size="100"
        >
          <img
            :src="avatar"
            alt="user avatar"
            v-if="avatar"
          >
          <v-icon 
            dark
            v-else
          >
            fa-user
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title 
            class="display-1"
          >
            {{ username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              class="mx-1"
              color="primary"
              v-for="role in roles"
              :key="role.id"
            >
              {{ role.name }}
            </v-chip>
            <div
              v-if="!roles"
            >
              No roles
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <div
          v-if="bio"
        >
          {{ bio }}
        </div>

        <div
          v-else
        >
          <i>No bio...</i>
        </div>

        <v-simple-table
          class="mt-6"
        >
          <tbody>
            <tr>
              <td>Registered</td>
              <td>{{ registeredAt }}</td>
            </tr>
            <tr>
              <td>Records Uploaded</td>
              <td>{{ uploadedRecordsTotal }}</td>
            </tr>
            <tr>
              <td>Records Favorited</td>
              <td>{{ uploadedRecordsTotal }}</td>
            </tr>
            <tr>
              <td>Folders</td>
              <td>{{ foldersTotal }}</td>
            </tr>
            <tr>
              <td>Friends</td>
              <td>{{ foldersTotal }}</td>
            </tr>
            <tr>
              <td>Threads</td>
              <td>{{ foldersTotal }}</td>
            </tr>
            <tr>
              <td>Posts</td>
              <td>{{ foldersTotal }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="error darken-1"
        >
          <v-icon left>
            fa-flag
          </v-icon>
          Report
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
        >
          <v-icon left>
            fa-envelope
          </v-icon>
          Send Message
        </v-btn>

        <v-btn
          color="pink lighten-1"
        >
          <v-icon left>
            fa-heart
          </v-icon>
          Add Friend
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="mt-8"
    >
      <CardHeader
        title="Uploads"
        :count="uploadedRecordsTotal"
      />

      <v-card-text>
        <ThumbnailSlider
          :records="uploadedRecords"
          :total="uploadedRecordsTotal"
        />
      </v-card-text> 
    </v-card>

    <v-card
      class="mt-8"
    >
      <CardHeader
        title="Favorites"
        :count="uploadedRecordsTotal"
      />

      <v-card-text>
        <ThumbnailSlider
          :records="uploadedRecords"
          :total="uploadedRecordsTotal"
        />
      </v-card-text> 
    </v-card>

  </v-container>
  
</template>

<script>
import gql from 'graphql-tag'
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'
import recordFitsQuery from '~/graphql/recordFit/recordFits.gql'
import siteThemesQuery from '~/graphql/siteTheme/siteThemes.gql'
import authedUserQuery from '~/graphql/auth/me.gql'
import CardHeader from "~/components/CardHeader";
import ThumbnailSlider from '~/components/Record/ThumbnailSlider.vue'

export default {
  components:{
    CardHeader,
    ThumbnailSlider,
  },

  data: () =>({
    user: null,
  }),

  created(){
    this.getUser()
  },

  computed:{
    ...mapGetters({

    }),

    userId(){
      return this.$route.params.id
    },

    bio(){
      if(!this.user)
        return null

      return this.user.profile.bio
    },

    uploadedRecords(){
      if(!this.user)
        return null

      return this.user.records.data
    },

    uploadedRecordsTotal(){
      if(!this.user)
        return 0

      return this.user.records.paginatorInfo.total
    },

    roles(){
      if(!this.user)
        return null

      return this.user.roles
    },

    username(){
      if(!this.user)
        return null

      return this.user.username
    },

    avatar(){
      if(!this.user)
        return null

      return this.user.avatar_url
    },

    registeredAt(){
      if(!this.user)
        return null

      return this.user.created_at
    },

    folders(){
      if(!this.user)
        return null

      return this.user.folders.data
    },

    foldersTotal(){
      if(!this.user)
        return null

      return this.user.folders.paginatorInfo.total
    },
  },

  methods: {
    ...mapMutations({
      
    }),

    ...mapActions({
      
    }),

    async getUser () {
      const query = gql`query($id: ID!){
        user(id: $id) {
          id
          username
          system_account
          avatar_url
          created_at
          roles{
            id
            name
          }
          profile{
            email
            bio
          }
          records(page: 1, first: 10){
            data{
              id
              thumbnail
            }
            paginatorInfo{
              total
            }
          }
          folders(page: 1, first: 10){
            data{
              id
              name
              cover_image
            }
            paginatorInfo{
              total
            }
          }
          favorites_folder{
            id
            name
            cover_image
          }
        }
      }`

      const variables = {
        id: this.userId
      }

      return this.$apollo.query({
          query,
          variables
        }).then(({data}) => {
          this.user = data.user
        })
    },
  },
  
}
</script>

<style scoped>
.input-row{
  min-height:68px;
}
</style>