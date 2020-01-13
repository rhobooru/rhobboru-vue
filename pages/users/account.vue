<template>

  <v-container>

    <v-card>
      <CardHeader
        title="Account"
      >
        <template v-slot:action>
          <v-btn
            text
            @click="editAccount"
            v-if="!editingAccount"
          >
            <v-icon left>
              fa-edit
            </v-icon>
            Edit
          </v-btn>

          <v-btn
            text
            @click="cancelEditAccount"
            v-if="editingAccount"
          >
            <v-icon left>
              fa-times
            </v-icon>
            Cancel
          </v-btn>
          <v-btn
            text
            @click="saveAccount"
            v-if="editingAccount"
          >
            <v-icon left>
              fa-save
            </v-icon>
            Save
          </v-btn>
        </template>
      </CardHeader>
      <v-card-text>
        <v-row
          class="input-row"
        >
          <v-col
            :cols="2"
          >
            Username
          </v-col>
          <v-col>
            <span
              class="title"
              v-show="!editingAccount"
            >
              {{ user.username }}
            </span>

            <v-text-field
              v-model="editedUsername"
              v-show="editingAccount"
              single-line
              dense
              :counter="255"
              placeholder="Username..."
              :height="20"
            />
          </v-col>
        </v-row>

        <v-row
          class="input-row"
        >
          <v-col
            :cols="2"
          >
            Email
          </v-col>
          <v-col>
            <span
              class="title"
              v-show="!editingAccount"
            >
              {{ user.email }}
            </span>

            <v-text-field
              v-model="editedEmail"
              v-show="editingAccount"
              single-line
              dense
              :counter="255"
              placeholder="Email..."
              :height="20"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      class="mt-8"
    >
      <CardHeader
        title="Settings"
      />

      <v-card-text>

        <v-select
          v-model="settings.recordViewing.fetchingStrategy.selected"
          :items="settings.recordViewing.fetchingStrategy.options"
          label="Record Fetching Strategy"
          item-id="id"
          item-text="name"
          persistent-hint
          return-object
          :hint="settings.recordViewing.fetchingStrategy.selected.description"
        ></v-select>

        <v-select
          v-model="selectedRecordFit"
          :items="recordFits"
          label="Record Fitting Strategy"
          item-id="id"
          item-text="name"
          persistent-hint
          return-object
          :hint="selectedRecordFit ? selectedRecordFit.description : ''"
        ></v-select>

        <v-select
          v-model="selectedSiteTheme"
          :items="siteThemes"
          label="Site Theme"
          item-id="id"
          item-text="name"
          persistent-hint
          return-object
          :hint="selectedSiteTheme ? selectedSiteTheme.description : ''"
        ></v-select>

      </v-card-text> 

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="primary"
        >
          <v-icon left>
            fa-save
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="mt-8"
    >
      <CardHeader
        title="Roles and Permissions"
      />

      <v-card-text>
        <div
          class="mb-1"
        >
          Roles
        </div>
        <v-chip
          class="ma-1"
          color="primary"
          v-for="role in userRoles"
          :key="role.id"
        >
          {{ role.name }}
        </v-chip>
        <div
          v-if="!userRoles"
        >
          No roles
        </div>

        <div
          class="mb-1 mt-4"
        >
          Permissions
        </div>
        <v-chip
          class="ma-1"
          v-for="(perm, index) in userPermissions"
          :key="index"
        >
          {{ perm.name }}
        </v-chip>
        <div
          v-if="!userPermissions"
        >
          No permissions
        </div>
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

export default {
  components:{
    CardHeader,
  },

  data: () =>({
    settings: {
      recordViewing: {
        fetchingStrategy: {
          selected: 0,
          options: [
            {
              id: 1,
              name: 'Always fetch previews',
              description: 'Lowest data usage, lowest image quality. Always fetches resized previews and allows you to request the original, if you want.',
            },
            {
              id: 2,
              name: 'Always fetch originals',
              description: 'Best image quality, slowest. Always fetches the original images but will take longer before you see anything.',
            },
            {
              id: 3,
              name: 'Fetch previews and auto-upgrade',
              description: 'Best experience, highest data usage. Fetches resized previews and automatically upgrades it to the original image in the background.',
            },
          ]
        },
      },
    },

    recordFits: null,
    selectedRecordFit: null,

    siteThemes: null,
    selectedSiteTheme: null,

    editingAccount: false,
    editedUsername: '',
    editedEmail: '',
  }),

  created(){
    this.getRecordFits()
    this.getSiteThemes()
  },

  computed:{
    ...mapGetters({
      user: 'auth/user',
      userRoles: 'auth/roles',
      userPermissions: 'auth/permissions',
    }),
  },

  methods: {
    ...mapMutations({
      updateUser: 'auth/updateUser',
    }),

    ...mapActions({
      refreshUser: 'auth/refreshUser',
    }),

    async getRecordFits () {
      return this.$apollo.query({
          query: recordFitsQuery
        }).then(({data}) => {
          this.recordFits = data.recordFits

          if(!this.selectedRecordFit)
            this.selectedRecordFit = this.recordFits.find(f => f.is_default)
        })
    },

    async getSiteThemes () {
      return this.$apollo.query({
          query: siteThemesQuery
        }).then(({data}) => {
          this.siteThemes = data.siteThemes

          if(!this.selectedSiteTheme)
            this.selectedSiteTheme = this.siteThemes.find(f => f.is_default)
        })
    },

    editAccount(){
      this.editingAccount = true

      this.editedUsername = this.user.username
    },

    cancelEditAccount(){
      this.editingAccount = false

    },

    async saveAccount(){
      this.editingAccount = false

      const mutation = gql`mutation($id: ID!, $username: String){
        updateUser(id: $id, username: $username){
          id
        }
      }`

      const variables = {
        id: this.user.id,
        username: this.editedUsername,
      }

      return this.$apollo.mutate({mutation, variables})
        .then(({ data }) => {
          this.refreshUser()
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