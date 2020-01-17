
export default function ({ store, route }) {
  window.setTimeout(() => {
    if(store.state.drawer.pageHasDrawer != route.name)
      store.commit('drawer/setPageHasDrawer', {value: false})
  }, 100)
}