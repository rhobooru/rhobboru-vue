<template>
  <transition
    name="slide-x-transition"
    mode="out-in"
  >
    <v-app-bar-nav-icon 
      v-if="$store.state.drawer.pageHasDrawer"
      @click.stop="toggleDrawer" 
      :color="$vuetify.theme.dark ? 'secondary' : 'primary'"
    />
    <div
      class="mr-9"
      v-else
    />
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SideBarToggle',

  methods:{
    ...mapMutations({
      toggleDrawer: 'drawer/toggle',
    }),
  }
}
</script>