<template>
  <v-card-title>
    <slot name="title">
      <span
        v-if="title"
      >
        {{ title }}
      </span>
      <span
        v-if="count"
        class="ml-2"
      >
        ({{ count }})
      </span>
    </slot>

    <v-divider
      class="ml-5 mr-2 brighter-divider"
    />

    <slot name="action" />
  </v-card-title>
</template>

<script>
export default {
  name: 'CardHeader',

  props: [
    'title',
    'count',
  ],
}
</script>

<style scoped>

</style>
