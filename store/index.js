import meQuery from '~/graphql/auth/me.gql'

export const actions = {
  nuxtClientInit ({ commit }, context) {
    context.store.dispatch('config/getConfig')

    const hasToken = !!this.$apolloHelpers.getToken()

    if (!hasToken) {
      context.store.commit('auth/logout')
      return
    }

    context.app.apolloProvider.defaultClient.query({
      query: meQuery
    }).then(({ data }) => {
      if (data && data.me) {
        context.store.commit('auth/updateUser', { user: data.me })
      } else {
        // Make sure the user looks unauthenticated.
        context.store.commit('auth/logout')
        // Need to call with `true` for the second argument to
        // avoid throwing errors about reseting the store while
        // queries are in flight.
        this.$apolloHelpers.onLogout(context.app.apolloProvider.defaultClient, true)
      }
    }).catch(({ error }) => {
      // Make sure the user looks unauthenticated.
      context.store.commit('auth/logout')
      // Need to call with `true` for the second argument to
      // avoid throwing errors about reseting the store while
      // queries are in flight.
      this.$apolloHelpers.onLogout(context.app.apolloProvider.defaultClient, true)

      console.error(error)
    })
  }
}
