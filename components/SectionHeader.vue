<template>
  <div class="section-header">
    <slot />

    <v-divider
      class="ml-5 brighter-divider"
    />
  </div>
</template>

<script>
export default {
  name: 'SectionHeader',
}
</script>

<style>
.section-header{
  display:flex;
  align-items: center;
}
</style>
