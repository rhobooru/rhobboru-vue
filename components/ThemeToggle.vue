<template>
  <v-btn
    icon
    small
    @click.prevent="setTheme(!$vuetify.theme.dark)"
  >
    <v-icon>
      fa-adjust
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'ThemeToggle',

  created () {
    this.setTheme(this.$storage.get('darkTheme', true))
  },

  methods: {
    setTheme (value) {
      this.$vuetify.theme.dark = value
      this.$storage.set('darkTheme', value)
    },
  }
}
</script>
