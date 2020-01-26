<template>
  <v-tooltip
    bottom
    content-class="tag-tooltip"
    :open-delay="500"
  >
    <template
      v-slot:activator="{ on }"
    >
      <v-chip
        nuxt
        :to="editable ? null : tagUrl"
        class="accent mb-2"
        :close="editable"
        :input-value="tag.isNew"
        :disabled="disabled"
        max-width="200"
        @click:close="closeTag"
        v-on="on"
      >
        <span
          class="tag-name text-truncate"
        >
          {{ tag.name }}
        </span>

        <span
          v-show="showCount"
          class="tag-count"
        >
          ({{ tag.records_count }})
        </span>
      </v-chip>
    </template>
    <div>
      <div class="subtitle-2 mb-3">
        {{ tag.name }}
      </div>

      <div v-show="tag.summary">
        <span class="overline text-uppercase">summary</span>
        <span
          class="body-2 pl-2"
          v-text="tag.summary"
        />
      </div>

      <div>
        <span class="overline text-uppercase">records</span>
        <span class="body-2 pl-2">{{ tag.records_count }}</span>
      </div>

      <div
        v-if="editable"
        class="overline font-italic mt-3"
      >
        click the X to remove
      </div>
      <div
        v-else
        class="overline font-italic mt-3"
      >
        click to view tag
      </div>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  name: 'TagChip',

  props: {
    editable: Boolean,
    tag: {
      type: Object,
      default: null,
    },
    disabled: Boolean,
    showCount: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({

  }),

  computed: {
    tagUrl () {
      if (!this.tag) { return '' }

      return '/tags/' + this.tag.id
    },
  },

  methods: {
    closeTag () {
      this.$emit('close', this.tag.id)
    }
  },
}
</script>

<style scoped>
.tag-name{
  display: inline-block;
  font-weight: bold;
}

.tag-count{
  display: inline-block;
  margin-left: 6px;
}
</style>

<style>
.tag-tooltip{
  text-align:left;
  background-color: rgba(50,50,50,1);
}
</style>
