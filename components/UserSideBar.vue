<template>
  <v-navigation-drawer
    class="user-sidebar"
    v-model="$store.state.drawer.userDrawerOpen"
    app
    right
    :stateless="true"
    :width="250"
  >
    <v-expansion-panels
      accordion
      hover
      mandatory
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div
            class="text-truncate title"
          >
            {{ username }}
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          class="user-panel-container"
        >
          <UserMenu 
            v-if="isAuthenticated"
            @logged-out="isLoggingIn = true"
          />
          <Login 
            v-else-if="isLoggingIn"
            @register="isRegistering = true; isLoggingIn = false"
            @logged-in="isLoggingIn = false"
          />
          <Register 
            v-else-if="isRegistering"
            @login="isRegistering = false; isLoggingIn = true"
            @registered="isRegistering = false"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel
        v-if="isAuthenticated"
      >
        <v-expansion-panel-header>
          <div
            class="text-truncate title"
          >
            Quick List
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          class="quick-list-container"
        >
          <QuickList />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import gql from 'graphql-tag'
import QuickList from '~/components/QuickList'
import UserMenu from '~/components/User/UserMenu'
import Login from '~/components/Auth/Login'
import Register from '~/components/Auth/Register'

export default {
  name: 'UserSideBar',

  components: {
    QuickList,
    UserMenu,
    Login,
    Register,
  },

  props:[
    
  ],

  data: () => ({
    isLoggingIn: true,
    isRegistering: false,
  }),

  created(){
    this.isLoggingIn = !this.isAuthenticated
  },

  watch: {
    
  },

  computed: {
    isAuthenticated(){
      return this.$store.state.auth.isAuthenticated
    },

    username(){
      return this.$store.state.auth.isAuthenticated
        ? this.$store.state.auth.user.username
        : 'Anonymous'
    },
  },

  methods: {

  }
}
</script>

<style>
  .user-sidebar > .v-navigation-drawer__content{
    padding-left:1px;
  }

  .quick-list-container > .v-expansion-panel-content__wrap{
    padding: 0px;
  }

  .user-panel-container > .v-expansion-panel-content__wrap{
    padding:0px;
  }
</style>