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
        @click:close="closeTag"
        :input-value="tag.isNew"
        :disabled="disabled"
        v-on="on"
      >
        <span
          class="tag-name text-truncate"
        >
          {{ tag.name }}
        </span>

        <span
          class="tag-count"
          v-show="showCount"
        >
          ({{ tag.records_count }})
        </span>
      </v-chip>
    </template>
    <div>
      <div class="subtitle-2 mb-3">
        {{ tag.name }}
      </div>

      <div v-show="tag.description">
        <span class="overline text-uppercase">desc</span>
        <span class="body-2 pl-2" v-html="tag.description" />
      </div>

      <div>
        <span class="overline text-uppercase">records</span>
        <span class="body-2 pl-2">{{ tag.records_count }}</span>
      </div>

      <div class="overline font-italic mt-3">click to view tag</div>
    </div>
  </v-tooltip>
</template>

<script>
import { stringify } from 'querystring'
export default {
  name: 'TagChip',

  props: {
    editable: Boolean,
    tag: Object,
    disabled: Boolean,
    showCount: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    tagUrl(){
      if(!this.tag)
        return ''

      return '/tags/' + this.tag.id
    },
  },

  data: () => ({

  }),

  methods:{
    closeTag(){
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
  max-width: 300px;
}
</style>