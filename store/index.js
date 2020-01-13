import meQuery from '~/graphql/auth/me.gql'

export const actions = {
  nuxtClientInit({ commit }, context) {
    const hasToken = !!this.$apolloHelpers.getToken()
    
    if(!hasToken)
      return

    context.app.apolloProvider.defaultClient.query({
        query: meQuery
    }).then(({data}) => {
      if(data && data.me){
        context.store.commit('auth/updateUser', { user: data.me })
      }
      else{
        context.store.commit('auth/logout')
        this.$apolloHelpers.onLogout()
      }
    }).catch(({error}) => {
      context.store.commit('auth/logout')
      this.$apolloHelpers.onLogout()
    })
  }
}