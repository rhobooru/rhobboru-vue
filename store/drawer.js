export const state = () => ({
  drawerOpen: true,
  userDrawerOpen: false,
})

export const mutations = {
  setDrawer (state, { value }) {
    state.drawerOpen = value
  },

  toggle (state) {
    state.drawerOpen = !state.drawerOpen
  },

  setUserDrawer (state, { value }) {
    state.userDrawerOpen = value
  },

  toggleUserDrawer (state) {
    state.userDrawerOpen = !state.userDrawerOpen
  },
}

export const getters = {
  
}