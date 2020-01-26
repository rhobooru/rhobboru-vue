import Vue from 'vue'

export const state = () => ({
  pageHasDrawer: false,
  drawerOpen: Vue.$storage.get('drawerOpen', true),

  userDrawerOpen: Vue.$storage.get('userDrawerOpen', false),
})

export const mutations = {
  setPageHasDrawer (state, { value }) {
    state.pageHasDrawer = value
  },

  setDrawer (state, { value }) {
    state.drawerOpen = value
    Vue.$storage.set('drawerOpen', state.drawerOpen)
  },

  toggle (state) {
    state.drawerOpen = !state.drawerOpen
    Vue.$storage.set('drawerOpen', state.drawerOpen)
  },

  setUserDrawer (state, { value }) {
    state.userDrawerOpen = value
    Vue.$storage.set('userDrawerOpen', state.userDrawerOpen)
  },

  toggleUserDrawer (state) {
    state.userDrawerOpen = !state.userDrawerOpen
    Vue.$storage.set('userDrawerOpen', state.userDrawerOpen)
  },
}

export const getters = {

}
