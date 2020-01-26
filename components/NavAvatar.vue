<template>
  <v-avatar
    :color="avatarUrl ? '' : 'secondary'"
    class="user-menu-button"
    @click.prevent="toggleUserDrawer"
  >
    <transition
      name="fade-transition"
      mode="out-in"
    >
      <img
        v-if="avatarUrl"
        key="avatar"
        :src="avatarUrl"
        alt="user avatar"
      >
      <span
        v-else-if="isAuthenticated"
        key="initial"
        class="white--text display-1"
      >
        {{ firstInitial }}
      </span>
      <v-icon
        v-else
        key="anon"
      >
        fa-user
      </v-icon>
    </transition>
  </v-avatar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'NavAvatar',

  computed: {
    ...mapGetters({
      user: 'auth/user',
      avatarUrl: 'auth/avatarUrl'
    }),

    isAuthenticated () {
      return this.$store.state.auth.isAuthenticated
    },

    firstInitial () {
      if (!this.$store.state.auth.isAuthenticated) { return null }

      return this.user.username[0]
    },
  },

  methods: {
    ...mapMutations({
      toggleUserDrawer: 'drawer/toggleUserDrawer',
    }),
  },
}
</script>

<style>
.user-menu-button{
  cursor: pointer;
}
</style>
