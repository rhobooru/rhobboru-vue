<template>
  <v-toolbar-items
    v-show="childNavItems"
  >
    <template
      v-for="item in childNavItems"
    >
      <transition
        :key="item.title"
        name="slide-y-transition"
        mode="out-in"
      >
        <template>
          <v-btn
            v-if="item.title !== '__divider__'"
            :key="item.title"
            nuxt
            :to="item.route"
            :exact="item.exact"
            text
          >
            <v-icon left>
              {{ item.icon }}
            </v-icon>
            {{ item.title }}
          </v-btn>
          <v-divider
            v-else
            :key="item.route + 'div'"
            vertical
            inset
          />
        </template>
      </transition>
    </template>
  </v-toolbar-items>
</template>

<script>
export default {
  name: 'SubNavLinks',

  components: {

  },

  props: [
    'navItem',
  ],

  data: () => ({

  }),

  computed: {
    childNavItems () {
      if (!this.navItem.children) { return [] }

      return [].concat(...this.navItem.children.map(f => [f, {
        title: '__divider__',
        route: f.route
      }]))
    },
  },

  methods: {

  },
}
</script>

<style>

</style>
