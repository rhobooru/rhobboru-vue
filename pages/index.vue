<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title>
          Rhobooru
        </v-card-title>

        <v-card-text>
           <v-btn color="primary" block>primary</v-btn>
           <v-btn color="secondary" block>secondary</v-btn>
           <v-btn color="accent" block>accent</v-btn>
           <v-btn color="info" block>info</v-btn>
           <v-btn color="success" block>success</v-btn>
           <v-btn color="warning" block>warning</v-btn>
           <v-btn color="error" block>error</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  components: {
  },

  methods:{
  },
}
</script>
