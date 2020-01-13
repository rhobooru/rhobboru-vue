<template>
  <div class="image-container">
    <v-img
      :src="imageUrl"
      :lazy-src="lazyUrl"
      position="center center"
      contain
      width="100%"
      height="100%"
    />
  </div>
</template>

<script>
export default {
  name: 'RecordMedia.vue',

  props: [
    'showPreview',
    'record',
    'preloadFullRes',
  ],

  data:() => ({
  }),

  watch:{
    preloadFullRes(val, oldVal){
      if(oldVal === false && val === true)
        this.preloadImage()
    },
  },

  computed:{
    imageUrl(){
      if(this.record == null)
        return ''

      if(this.showPreview)
        return this.record.preview || this.record.image

      return this.record.image
    },

    lazyUrl(){
      if(this.record == null)
        return ''

      if(this.showPreview)
        return this.record.thumbnail || this.record.preview

      return this.record.preview
    },
  },

  methods:{
    preloadImage(){
      const image = new Image()
      image.src = this.record.image
    },
  },
}
</script>

<style scoped>
  .image-container {
    max-width:100%;
    height:calc(100vh - 200px);
  }

  .image-container > .v-image {
    max-height:100%;
    max-width:100%;
  }
</style>