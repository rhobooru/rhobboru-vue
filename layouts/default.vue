<template>
  <v-app
    :dark="$vuetify.theme.dark"
  >
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-toolbar-title
        class="mr-5"
        v-text="title"
      />

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
            <v-icon left>
              {{ item.icon }}
            </v-icon>
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

      <nav-avatar />

      <template v-slot:extension>
        <side-bar-toggle />

        <v-divider
          v-show="$store.state.drawer.pageHasDrawer || activeNavItem.children"
          vertical
          inset
        />

        <sub-nav-link
          :nav-item="activeNavItem"
        />

        <v-spacer />

        <theme-toggle />
      </template>
    </v-app-bar>

    <user-side-bar />

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
import UserSideBar from '~/components/UserSideBar'
import SubNavLink from '~/components/SubNavLinks'
import ThemeToggle from '~/components/ThemeToggle'
import SideBarToggle from '~/components/SideBarToggle'
import NavAvatar from '~/components/NavAvatar'

export default {
  components: {
    UserSideBar,
    SubNavLink,
    ThemeToggle,
    SideBarToggle,
    NavAvatar,
  },

  data () {
    return {
      navItems: [
        {
          route: '/records',
          title: 'Records',
          icon: 'fa-image',
          exact: false,
          children: [
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
          children: [
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
          children: [
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
          children: [
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

  computed: {
    title () {
      return process.env.appName
    },

    activeNavItem () {
      return this.navItems.find(f => this.$route.fullPath.startsWith(this.$router.resolve(f.route).route.fullPath)) || {}
    },
  },

  methods: {
    isExactActive (to) {
      return this.$route.fullPath === this.resolvedRoute(to).route.fullPath
    },

    resolvedRoute (to) {
      return this.$router.resolve(to)
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
</style>
