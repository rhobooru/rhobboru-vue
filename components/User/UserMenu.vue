<template>
  <v-list>
    <v-list-item
      nuxt
      to="/dashboard"
    >
      <v-list-item-icon>
        <v-icon>
          fa-digital-tachograph
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Dashboard
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    
    <v-list-item
      nuxt
      to="/inbox"
    >
      <v-list-item-icon>
        <v-icon>
          fa-envelope
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Inbox
        </v-list-item-title>            
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      nuxt
      :to="'/users/' + $store.state.auth.user.id"
    >
      <v-list-item-icon>
        <v-icon>
          fa-user
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Profile
        </v-list-item-title>            
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      nuxt
      to="/users/account"
    >
      <v-list-item-icon>
        <v-icon>
          fa-cogs
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Account
        </v-list-item-title>            
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      @click.prevent="logOut"
    >
      <v-list-item-icon>
        <v-icon>
          fa-sign-out-alt
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Log Out
        </v-list-item-title>            
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapMutations } from 'vuex'
import logoutMutation from '~/graphql/auth/logout.gql'

export default {
  name: 'UserMenu',

  data: () => ({
  }),

  computed:{
    isAuthenticated(){
      return this.$store.state.auth.isAuthenticated
    },

    user(){
      return this.$store.state.auth.user
    },
  },

  methods:{
    ...mapMutations({
      saveLogout: 'auth/logout'
    }),

    async logOut () {
      try {
          const res = await this.$apollo.mutate({
              mutation: logoutMutation
          }).then(({data}) => data && data.logout)
          await this.$apolloHelpers.onLogout()
          this.saveLogout()
      } catch (e) {
          console.error(e)
      }
    },
  }
}
</script>

<style scoped>


</style>