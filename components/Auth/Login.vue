<template>
  <v-form
    ref="loginForm"
    @submit.prevent="login"
  >
    <v-list
      :loading="isLoggingIn"
      dense
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
            type="submit"
            :disabled="!hasInput"
            @click.prevent="login"
          >
            <v-icon left>
              fa-sign-in-alt
            </v-icon>Login
          </v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="secondary"
            @click.prevent="register"
          >
            <v-icon left>
              fa-edit
            </v-icon>Register
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-banner
      v-show="isError"
      color="error"
    >
      <v-avatar slot="icon">
        <v-icon>fa-exclamation</v-icon>
      </v-avatar>Login failed
    </v-banner>
  </v-form>
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

    isError: false,
  }),

  computed: {
    hasInput () {
      return this.username && this.password
    },
  },

  methods: {
    ...mapMutations({
      saveLogin: 'auth/login',
    }),

    async login () {
      this.isLoggingIn = true

      try {
        const res = await this.$apollo
          .mutate({
            mutation: loginMutation,
            variables: {
              username: this.username,
              password: this.password,
            },
          })
          .then(({ data }) => data && data.login)
        await this.$apolloHelpers.onLogin(res.access_token)
        this.saveLogin({ user: res.user })

        this.$emit('logged-in')
      } catch (e) {
        this.showError()
      }

      this.isLoggingIn = false
    },

    register () {
      this.$emit('register')
    },

    showError () {
      this.isError = true

      window.setTimeout(() => {
        this.isError = false
      }, 4000)
    },
  },
}
</script>

<style scoped>
</style>
