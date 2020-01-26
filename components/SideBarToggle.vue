<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <v-app-bar-nav-icon
      v-if="$store.state.drawer.pageHasDrawer"
      :color="$vuetify.theme.dark ? 'secondary' : 'primary'"
      @click.stop="toggleDrawer"
    />
    <div
      v-else
      class="mr-9"
    />
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SideBarToggle',

  methods: {
    ...mapMutations({
      toggleDrawer: 'drawer/toggle',
    }),
  }
}
</script>
