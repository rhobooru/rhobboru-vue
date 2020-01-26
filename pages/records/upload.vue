<template>
  <v-container>
    <v-slide-y-reverse-transition group>
      <template
        v-for="slot in uploadSlots"
      >
        <upload-record
          :key="slot.index"
          @file-picked="addAnotherUpload(slot.index)"
        />
      </template>
    </v-slide-y-reverse-transition>
  </v-container>
</template>

<script>
import UploadRecord from '~/components/UploadRecord.vue'

export default {
  components: {
    UploadRecord,
  },

  data () {
    return {
      uploadSlots: [
        {
          index: 0,
          dirty: false,
        },
      ],
    }
  },

  computed: {
    cleanSlots () {
      return !!this.uploadSlots.find(f => !f.dirty)
    },
  },

  created () {

  },

  methods: {

    addAnotherUpload (slot) {
      this.uploadSlots[slot].dirty = true

      if (!this.cleanSlots) {
        this.uploadSlots.push({
          index: this.uploadSlots.length,
          dirty: false,
        })
      }
    },
  },
}
</script>
