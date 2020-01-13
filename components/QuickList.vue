<template>
  <v-expansion-panels
    accordion
    hover
    multiple
    dense
  >
    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-2"
      >
        Records
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        record list
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-2"
      >
        Folders
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        folder list
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-2"
      >
        Tags
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        tag list
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-2"
      >
        Users
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        user list
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'QuickList',

  components: {
  },

  props:[
    
  ],

  data: () => ({
    
  }),

  watch: {
    
  },

  computed: {

  },

  methods: {

  }
}
</script>