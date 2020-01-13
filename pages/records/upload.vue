<template>
  <v-container>

    <v-slide-y-reverse-transition group>
      <template
        v-for="slot in uploadSlots"
      >
        <UploadRecord 
          :key="slot.index"
          v-on:file-picked="addAnotherUpload(slot.index)"
        />
      </template>
    </v-slide-y-reverse-transition>

  </v-container>
</template>

<script>
import UploadRecord from '~/components/UploadRecord.vue'

export default {
  components:{
    UploadRecord,
  },

  data: function() {
    return {
      uploadSlots: [
        {
          index: 0,
          dirty: false,
        }
      ],
    }
  },
  
  created: function () {
    
  },

  computed: {
    cleanSlots(){
      return this.uploadSlots.find(f => !f.dirty) ? true : false
    },
  },

  methods:{

    addAnotherUpload(slot){
      this.uploadSlots[slot].dirty = true

      if(!this.cleanSlots)
        this.uploadSlots.push({
          index: this.uploadSlots.length,
          dirty: false,
        })
    },
  },
}
</script>
