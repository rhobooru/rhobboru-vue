import _ from 'lodash'
import gql from 'graphql-tag'

export const state = () => ({
  config: null,
})

export const mutations = {
  updateConfig (state, { config }) {
    state.config = config
  },
}

export const getters = {
  get: state => (key) => {
    return state.config && _.get(state.config, key)
  },
}

export const actions = {
  getConfig ({ state, commit, rootState }) {
    this.app.apolloProvider.defaultClient.query({
      query: gql`{config}`,
      fetchPolicy: 'network-only'
    }).then(({ data }) => {
      if (data && data.config && data.config) {
        commit('updateConfig', { config: data.config })
      } else {
        //
      }
    }).catch(({ error }) => {
      console.error(error)
    })
  }
}
