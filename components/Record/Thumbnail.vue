<template>
  <div 
    class="thumbnail"
    :style="{ width: thumbnailSize + 'px', height: thumbnailSize + 'px' }"
  >
    <nuxt-link :to="url">
      <v-img
        :lazy-src="imagePlaceholder"
        :src="thumbnail"
        :height="imageDimensions.height"
        :width="imageDimensions.width"
        contain
        position="center center"
        @load="thumbnailLoaded"
      >
      </v-img>
    </nuxt-link>
  </div>
</template>

<script>
import imagePlaceholder from '~/assets/imagePlaceholder.js'

export default {
  name: 'Thumbnail',

  props: [
    'size',
    'record',
  ],

  data: function() {
    return {
      imagePlaceholder: imagePlaceholder.src,
      thumbnailSize: 200,
    }
  },
  
  created: function () {
    this.thumbnailSize = this.size || this.thumbnailSize
  },

  computed: {
    thumbnail(){
      return this.record.thumbnail
    },

    url(){
      return '/records/' + this.record.id
    },

    imageDimensions(){
      const ratio = this.record.width / this.record.height
      let targetWidth
      let targetHeight 
      
      targetWidth = targetHeight = Math.min(this.thumbnailSize, Math.max(this.record.width, this.record.height));

      if (ratio < 1) {
          targetWidth = targetHeight * ratio;
      } else {
          targetHeight = targetWidth / ratio;
      }

      return {
        width: targetWidth,
        height: targetHeight
      }
    },
  },

  methods:{
    thumbnailLoaded(){
      this.$emit('loaded')
    },
  },
}
</script>

<style scoped>
.thumbnail {
  display:inline-block;
  position: relative;
  margin:10px;
  vertical-align: top;
}

.thumbnail > a {
  display: block;
  margin-top: 50%;
  transform: translateY(-50%);
  position: relative;
  text-align: center;
}

.thumbnail .v-image {
  position: relative;
  margin:0 auto;
}
</style>