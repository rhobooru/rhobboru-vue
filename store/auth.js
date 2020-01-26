import Vue from 'vue'
import meQuery from '~/graphql/auth/me.gql'

export const state = () => ({
  isAuthenticated: false,
  user: null,
  cachedAvatarUrl: Vue.$storage.get('avatarUrl', null),
})

export const mutations = {
  login (state, { user }) {
    state.user = JSON.parse(JSON.stringify(user))
    state.isAuthenticated = true

    Vue.$storage.set('avatarUrl', user.avatar_url)
  },

  updateUser (state, { user }) {
    state.user = JSON.parse(JSON.stringify(user))
    state.isAuthenticated = true

    Vue.$storage.set('avatarUrl', user.avatar_url)
  },

  logout (state) {
    state.user = null
    state.isAuthenticated = false
    state.cachedAvatarUrl = null

    Vue.$storage.remove('avatarUrl')
  },
}

export const getters = {
  userHasPermission: state => (permission) => {
    return state.user && state.user.all_permissions.find(item => item.name === permission)
  },

  roles: (state) => {
    if (!state.user) { return null }

    return state.user.roles
  },

  permissions: (state) => {
    if (!state.user) { return null }

    return state.user.all_permissions
  },

  user: (state) => {
    if (!state.user) { return {} }

    return state.user
  },

  avatarUrl: (state) => {
    if (state.user) { return state.user.avatar_url }

    return state.cachedAvatarUrl
  },
}

export const actions = {
  refreshUser ({ state, commit, rootState }) {
    const hasToken = !!this.$apolloHelpers.getToken()

    if (!hasToken) { return }

    this.app.apolloProvider.defaultClient.query({
      query: meQuery,
      fetchPolicy: 'network-only'
    }).then(({ data }) => {
      if (data && data.me) {
        commit('updateUser', { user: data.me })
      } else {
        commit('logout')
        this.$apolloHelpers.onLogout()
      }
    }).catch(({ error }) => {
      console.error(error)
      commit('logout')
      this.$apolloHelpers.onLogout()
    })
  }
}
