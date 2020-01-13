import meQuery from '~/graphql/auth/me.gql'

export const state = () => ({
  isAuthenticated: false,
  user: null,
})

export const mutations = {
  login (state, { user }) {
    state.user = JSON.parse(JSON.stringify(user))
    state.isAuthenticated = true
  },

  updateUser (state, { user }) {
    state.user = JSON.parse(JSON.stringify(user))
    state.isAuthenticated = true
  },

  logout (state) {
    state.user = null
    state.isAuthenticated = false
  },
}

export const getters = {
  userHasPermission: (state) => (permission) => {
    return state.user && state.user.all_permissions.find(item => item.name === permission)
  },

  roles: (state) => {
    if(!state.user)
      return null

    return state.user.roles
  },

  permissions: (state) => {
    if(!state.user)
      return null

    return state.user.all_permissions
  },

  user: (state) => {
    if(!state.user)
      return {}

    return state.user
  },
}

export const actions = {
  refreshUser({ state, commit, rootState }) {
    const hasToken = !!this.$apolloHelpers.getToken()
    
    if(!hasToken)
      return

    this.app.apolloProvider.defaultClient.query({
      query: meQuery,
      fetchPolicy: 'network-only'
    }).then(({data}) => {
      if(data && data.me){
        commit('updateUser', { user: data.me })
      }
      else{
        commit('logout')
        this.$apolloHelpers.onLogout()
      }
    }).catch(({error}) => {
      commit('logout')
      this.$apolloHelpers.onLogout()
    })
  }
}