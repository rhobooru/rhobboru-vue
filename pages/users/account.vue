<template>
  <v-container>
    <v-card>
      <card-header title="Account">
        <template v-slot:action>
          <v-btn
            v-if="!editingAccount"
            text
            @click="editAccount"
          >
            <v-icon left>
              fa-edit
            </v-icon>
            Edit
          </v-btn>

          <v-btn
            v-if="editingAccount"
            text
            @click="cancelEditAccount"
          >
            <v-icon left>
              fa-times
            </v-icon>
            Cancel
          </v-btn>
          <v-btn
            v-if="editingAccount"
            text
            :disabled="!accountFormValid"
            @click="saveAccount"
          >
            <v-icon left>
              fa-save
            </v-icon>
            Save
          </v-btn>
        </template>
      </card-header>
      <v-card-text>
        <v-form v-model="accountFormValid">
          <v-row class="input-row">
            <v-col :cols="2">
              Username
            </v-col>
            <v-col>
              <span
                v-show="!editingAccount"
                class="title"
              >
                {{ user.username }}
              </span>

              <v-text-field
                v-show="editingAccount"
                v-model="editedUsername"
                single-line
                dense
                :counter="255"
                placeholder="Username..."
                :height="20"
                :rules="[v => !!v || 'Username is required']"
              />
            </v-col>
          </v-row>

          <v-row class="input-row">
            <v-col :cols="2">
              Email
            </v-col>
            <v-col>
              <span
                v-show="!editingAccount"
                class="title"
              >
                {{ user && user.email }}
              </span>

              <v-text-field
                v-show="editingAccount"
                v-model="editedEmail"
                single-line
                dense
                :counter="255"
                placeholder="Email..."
                :height="20"
                :rules="[v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid']"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col :cols="2">
              Bio
            </v-col>
            <v-col>
              <div
                v-show="!editingAccount"
                class="title"
                v-html="user && user.bio"
              />

              <editor
                v-show="editingAccount"
                :content="user.bio"
                placeholder="bio..."
                @changed="v => editedBio = v"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-8">
      <card-header title="Settings" />

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
        />

        <v-select
          v-model="selectedRecordFit"
          :items="settings.recordViewing.fetchingStrategy.options"
          label="Record Fitting Strategy"
          item-id="id"
          item-text="name"
          persistent-hint
          return-object
          :hint="selectedRecordFit ? selectedRecordFit.description : ''"
        />

        <v-switch
          v-model="useDarkTheme"
          label="Use Dark Theme"
          inset
          color="secondary"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn color="primary">
          <v-icon left>
            fa-save
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-8">
      <card-header title="Roles and Permissions" />

      <v-card-text>
        <div class="mb-1">
          Roles
        </div>
        <v-chip
          v-for="role in userRoles"
          :key="role.id"
          class="ma-1"
          color="primary"
        >
          {{ role.name }}
        </v-chip>
        <div v-if="!userRoles">
          No roles
        </div>

        <div class="mb-1 mt-4">
          Permissions
        </div>
        <v-chip
          v-for="(perm, index) in userPermissions"
          :key="index"
          class="ma-1"
        >
          {{ perm.name }}
        </v-chip>
        <div v-if="!userPermissions">
          No permissions
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import recordFitsQuery from '~/graphql/recordFit/recordFits.gql'
import updateUserMutation from '~/graphql/user/updateUserAccount.gql'
import CardHeader from '~/components/CardHeader'
import Editor from '~/components/Editor'

export default {
  components: {
    CardHeader,
    Editor,
  },

  data: () => ({
    settings: {
      recordViewing: {
        fetchingStrategy: {
          selected: 0,
          options: [
            {
              id: 1,
              name: 'Always fetch previews',
              description:
                'Lowest data usage, lowest image quality. Always fetches resized previews and allows you to request the original, if you want.',
            },
            {
              id: 2,
              name: 'Always fetch originals',
              description:
                'Best image quality, slowest. Always fetches the original images but will take longer before you see anything.',
            },
            {
              id: 3,
              name: 'Fetch previews and auto-upgrade',
              description:
                'Best experience, highest data usage. Fetches resized previews and automatically upgrades it to the original image in the background.',
            },
          ],
        },
      },
    },

    recordFits: null,
    selectedRecordFit: null,

    useDarkTheme: true,

    editingAccount: false,
    editedUsername: '',
    editedEmail: '',
    editedBio: '',

    accountFormValid: false,
  }),

  computed: {
    ...mapGetters({
      user: 'auth/user',
      userRoles: 'auth/roles',
      userPermissions: 'auth/permissions',
    }),
  },

  created () {
    this.getRecordFits()

    this.useDarkTheme = true // this.user.settings.dark_theme
  },

  methods: {
    ...mapMutations({
      updateUser: 'auth/updateUser',
    }),

    ...mapActions({
      refreshUser: 'auth/refreshUser',
    }),

    getRecordFits () {
      this.$apollo
        .query({
          query: recordFitsQuery,
        })
        .then(({ data }) => {
          this.recordFits = data.recordFits

          if (!this.selectedRecordFit) { this.selectedRecordFit = this.recordFits.find(f => f.is_default) }
        })
    },

    editAccount () {
      this.editingAccount = true

      this.editedUsername = this.user.username
      this.editedEmail = this.user.email
      this.editedBio = this.user.bio
    },

    cancelEditAccount () {
      this.editingAccount = false
    },

    saveAccount () {
      this.editingAccount = false

      const variables = {
        id: this.user.id,
        username: this.editedUsername,
        email: this.editedEmail,
        bio: this.editedBio,
      }

      return new Promise((resolve, reject) => {
        this.$apollo
          .mutate({ mutation: updateUserMutation, variables })
          .then((result) => {
            this.updateUser({ user: result.data.updateUser })

            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}
</script>

<style scoped>
.input-row {
  min-height: 68px;
}
</style>
