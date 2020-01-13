<template>
  <div>
    <v-card>
      <v-card-text>
        <v-form
          ref="createTag"
          v-model="valid"
        >
          <v-text-field
            v-model="name"
            :counter="maxNameLength"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <br><br>

          <div class="subtitle-1 pb-2">Description</div>
          <Editor 
            :content="description" 
            :doClear="clearEditor"
            @changed="descriptionChanged"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>

        <v-btn
          text
          @click="reset"
        >
          <v-icon left>
            fa-times
          </v-icon>
          Clear Form
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!valid"
          color="primary"
          class="mr-2"
          @click="createAndStay"
        >
          <v-icon left>
            fa-plus
          </v-icon>
          Create and stay
        </v-btn>

        <v-btn
          :disabled="!valid"
          color="primary"
          @click="createAndView"
        >
          <v-icon left>
            fa-external-link-alt
          </v-icon>
          Create and view
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      color="success darken-2"
      v-model="successSnackbar"
      :timeout="snackbarTimeout"
    >
      Tag created
      <v-btn
        text
        @click="successSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar
      color="error darken-1"
      v-model="errorSnackbar"
    >
      Something went wrong
      <v-btn
        text
        @click="errorSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Editor from "~/components/Editor";
import gql from 'graphql-tag'

export default {
  components: {
    Editor,
  },

  data: () => ({
    valid: false,
    clearEditor: false,

    name: '',
    maxNameLength: 255,

    description: '',

    successSnackbar: false,
    snackbarTimeout: 3000,

    errorSnackbar: false,
  }),

  computed:{
    nameRules(){
      return [
        v => !!v || 'Name is required',
        v => (v && v.length <= this.maxNameLength) || 'Name must be less than 255 characters',
      ]
    },
  },

  methods: {
    validateForm(){
      return this.$refs.createTag.validate()
    },

    createTag(){
      if (!this.validateForm())
        return

      const mutation = gql`mutation(
          $name: String!
          $description: String
        ){
          createTag(
            name: $name
            description: $description
          ){
            id
          }
        }`
      const variables = {
        name: this.name,
        description: this.description,
      }

      return this.$apollo.mutate({mutation, variables})
      .catch(({ error }) => {
        this.errorSnackbar = true
      })
    },

    createAndStay(){
      if (!this.validateForm())
        return

      this.createTag()
        .then(({ data }) => {
          this.reset()
          this.successSnackbar = true
        })
    },

    createAndView() {
      if (!this.validateForm())
        return

      this.createTag()
        .then(({ data }) => {
          this.$router.push({ name: 'tags-id', params: { id: data.createTag.id } })
        })
    },

    reset() {
      this.$refs.createTag.reset()
      this.clearEditor = true

      this.$nextTick(() => {
        this.clearEditor = false
      })
    },

    resetValidation() {
      this.$refs.createTag.resetValidation()
    },

    descriptionChanged(value){
      this.description = value
    },
  },
}
</script>

<style>

/* .ProseMirror{
  padding:10px;
  font-size: 16px;
  font-weight: 400;
} */

</style>