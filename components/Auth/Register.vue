<template>

  <v-form
    @submit.prevent="register"
    ref="registerForm"
    v-model="valid"
    lazy-validation
  >
    <v-list
      :loading="isRegistering"
      dense
    >
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="username"
            label="Username"
            single-line
            required
            :rules="usernameRules"
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
            :rules="passwordRules"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm password"
            type="password"
            single-line
            required
            :rules="confirmPasswordRules"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="primary"
            type="submit"
            @click.prevent="register"
            :disabled="!hasInput || !valid"
          >
            <v-icon left>
              fa-edit
            </v-icon>
            Register
          </v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="secondary"
            @click.prevent="login"
          >
            <v-icon left>
              fa-sign-in-alt
            </v-icon>
            Login
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-banner
      v-show="isError"
      color="error"
    >
      <v-avatar
        slot="icon"
      >
        <v-icon>
          fa-exclamation
        </v-icon>
      </v-avatar>

      Registration failed
    </v-banner>
  </v-form>
  
</template>

<script>
import { mapMutations } from 'vuex'
import registerMutation from '~/graphql/auth/register.gql'

export default {
  name: 'Register',

  data: () => ({
    username: null,
    password: null,
    confirmPassword: null,

    usernameRules: [
      v => !!v || 'Username is required',
    ],

    passwordRules: [
      v => !!v || 'Password is required',
    ],

    isRegistering: false,

    isError: false,
    valid: true,
  }),

  computed:{
    hasInput(){
      return this.username && this.password && this.confirmPassword
    },
    
    confirmPasswordRules() {
      return [
        v => !!v || 'Password confirmation is required',
        v => (!!v && v) === this.password || 'Passwords must match',
      ]
    },
  },

  watch: {
    username: 'validateField',
    password: 'validateField',
    confirmPassword: 'validateField',
  },

  methods:{
    ...mapMutations({
      saveLogin: 'auth/login'
    }),

    validateField () {
      this.$refs.registerForm.validate()
    },

    async register () {
      this.isRegistering = true

      try {
        const res = await this.$apollo.mutate({
            mutation: registerMutation,
            variables: {
              username: this.username,
              password: this.password,
              passwordConfirm: this.confirmPassword,
            }
        }).then(({data}) => data && data.register)
        await this.$apolloHelpers.onLogin(res.access_token)
        this.saveLogin({user: res.user})

        this.$emit('registered')
      } catch (e) {
        this.showError()
      }

      this.isRegistering = false
    },

    login(){
      this.$refs.registerForm.reset()
      this.$emit('login')
    },

    showError(){
      this.isError = true

      window.setTimeout(() =>{
        this.isError = false
      }, 4000)
    }
  }
}
</script>

<style scoped>

</style>