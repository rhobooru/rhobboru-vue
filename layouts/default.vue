<template>
  <v-app
    :dark="$vuetify.theme.dark"
  >

    <v-app-bar 
      clipped-left 
      fixed 
      app
    >
      <v-toolbar-title v-text="title" class="mr-5" />

      <v-divider 
        vertical
        inset
      />

      <v-toolbar-items>
        <template
          v-for="item in navItems"
        >
          <v-btn 
            :key="item.title"
            nuxt 
            :to="item.route" 
            :exact="item.exact"
            text
          >
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
          <v-divider 
            :key="item.title + 'div'"
            vertical
            inset
          />
        </template>
      </v-toolbar-items>

      <v-spacer />

      <v-avatar 
        :color="avatarUrl ? '' : 'secondary'"
        class="user-menu-button"
        @click.prevent="toggleUserDrawer"
      >
        <img
          :src="avatarUrl"
          alt="user avatar"
          v-if="avatarUrl"
        >
        <span 
          class="white--text display-1"
          v-else-if="isAuthenticated"
        >
          {{ firstInitial }}
        </span>
        <v-icon
          v-else
        >
          fa-user
        </v-icon>
      </v-avatar>

    
      <template v-slot:extension>
        <v-app-bar-nav-icon @click.stop="toggleDrawer" />

        <v-toolbar-items
          v-show="childNavItems"
        >
          <template
            v-for="item in childNavItems"
          >
            <v-btn 
              :key="item.title"
              nuxt 
              :to="item.route" 
              :exact="item.exact"
              text
            >
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
            <v-divider 
              :key="item.title + 'div'"
              vertical
              inset
            />
          </template>
        </v-toolbar-items>

        <v-spacer />

        <v-btn
          icon 
          small
          @click.prevent="setTheme(!$vuetify.theme.dark)"
        >
          <v-icon>
            fa-adjust
          </v-icon>
        </v-btn>
      </template>

    </v-app-bar>

    <UserSideBar />


    <v-content>
      <v-container
        fluid
      >
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import UserSideBar from '~/components/UserSideBar'

export default {
  components: {
    UserSideBar,
  },

  data() {
    return {
      title: 'rhobooru',

      test: [],

      navItems: [
        {
          route: '/records',
          title: 'Records',
          icon: 'fa-image',
          exact: false,
          children:[
            {
              route: '/records',
              title: 'List',
              icon: 'fa-image',
              exact: true,
            },
            {
              route: '/records/upload',
              title: 'Upload',
              icon: 'fa-upload',
              exact: true,
            },
          ],
        },
        {
          route: '/communities',
          title: 'Communities',
          icon: 'fa-users',
          exact: false,
          children:[
            {
              route: '/communities',
              title: 'List',
              icon: 'fa-users',
              exact: true,
            },
            {
              route: '/communities/create',
              title: 'Create',
              icon: 'fa-plus',
              exact: true,
            },
          ],
        },
        {
          route: '/folders',
          title: 'Folders',
          icon: 'fa-folder-open',
          exact: false,
          children:[
            {
              route: '/folders',
              title: 'List',
              icon: 'fa-folder-open',
              exact: true,
            },
            {
              route: '/folders/create',
              title: 'Create',
              icon: 'fa-plus',
              exact: true,
            },
          ],
        },
        {
          route: '/tags',
          title: 'Tags',
          icon: 'fa-tag',
          exact: false,
          children:[
            {
              route: '/tags',
              title: 'List',
              icon: 'fa-tag',
              exact: true,
            },
            {
              route: '/tags/create',
              title: 'Create',
              icon: 'fa-plus',
              exact: true,
            },
          ],
        },
        {
          route: '/forum',
          title: 'Forum',
          icon: 'fa-comments',
          exact: false,
        },
      ],
    }
  },

  created() {
    this.setTheme(this.$storage.get('darkTheme', true))
  },

  computed:{
    ...mapGetters({
      user: 'auth/user',
      avatarUrl: 'auth/avatarUrl'
    }),

    activeNavItem(){
      return this.navItems.find(f => this.$route.fullPath.startsWith(this.$router.resolve(f.route).route.fullPath)) || {}
    },

    childNavItems(){
      return this.activeNavItem.children
    },

    isAuthenticated(){
      return this.$store.state.auth.isAuthenticated
    },

    firstInitial(){
      if(!this.$store.state.auth.isAuthenticated)
        return null

      return this.user.username[0]
    },
  },

  methods:{
    ...mapMutations({
      toggleDrawer: 'drawer/toggle',
      toggleUserDrawer: 'drawer/toggleUserDrawer',
    }),

    isExactActive(to){
        return this.$route.fullPath == this.resolvedRoute(to).route.fullPath
    },

    resolvedRoute(to){
        return this.$router.resolve(to)
    },

    setTheme(value){
      this.$vuetify.theme.dark = value
      this.$storage.set('darkTheme', value)
    },
  },
}
</script>

<style>
  .theme--dark .v-toolbar__extension{
    border-top:1px solid rgba(255, 255, 255, 0.24);
  }

  .theme--light .v-toolbar__extension{
    border-top:1px solid rgba(19, 19, 19, 0.24);
  }

  .user-menu-button{
    cursor: pointer;
  }
</style>
