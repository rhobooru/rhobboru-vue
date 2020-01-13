<template>

  <v-list
    :loading="isLoggingIn"
  >
    <v-list-item>
      <v-list-item-content>
        <v-text-field
          v-model="username"
          label="Username"
          single-line
          required
        />
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          single-line
          required
        />
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-btn
          color="primary"
          @click.prevent="onSubmit"
          :disabled="!hasInput"
        >
          <v-icon left>
            fa-sign-in-alt
          </v-icon>
          Login
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  
</template>

<script>
import { mapMutations } from 'vuex'
import loginMutation from '~/graphql/auth/login.gql'

export default {
  name: 'Login',

  data: () => ({
    username: null,
    password: null,

    isLoggingIn: false,
  }),

  computed:{
    hasInput(){
      return this.username && this.password
    },

    isAuthenticated(){
      return this.$store.state.auth.isAuthenticated
    },
  },

  methods:{
    ...mapMutations({
      saveLogin: 'auth/login'
    }),

    async onSubmit () {
      this.isLoggingIn = true

      try {
          const res = await this.$apollo.mutate({
              mutation: loginMutation,
              variables: {
                username: this.username,
                password: this.password,
              }
          }).then(({data}) => data && data.login)
          await this.$apolloHelpers.onLogin(res.access_token)
          this.saveLogin({user: res.user})
      } catch (e) {
          console.error(e)
      }

      this.isLoggingIn = false
    },
  }
}
</script>

<style scoped>

</style>