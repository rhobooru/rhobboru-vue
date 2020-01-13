<template>
  <div>
    <tiptap-vuetify 
      v-model="myContent" 
      :extensions="extensions"
      :toolbar-attributes="toolbarAttrs"
      :placeholder="placeholder"
      :card-props="{ flat: true }"
      @init="editorInit"
    />
  </div>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  CodeBlock,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from "tiptap-vuetify";

export default {
  components: { 
    TiptapVuetify 
  },

  props:[
    'content',
    'placeholder',
    'doClear',
  ],

  data: () => ({
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3]
          }
        }
      ],
      Bold,
      Link,
      Code,
      CodeBlock,
      HorizontalRule,
      Paragraph,
      HardBreak
    ],

    myContent: '',

    editor: null,
  }),

  created(){
    this.myContent = this.content || ''
  },

  computed: {
    toolbarAttrs () {
      return this.$vuetify.theme.isDark
        ? { color: 'grey darken-4', dark: true }
        : { color: 'white' }
    }
  },

  watch: {
    myContent(){
      this.$emit('changed', this.myContent)
    },

    doClear(val){
      if(val)
        this.clear()
    }
  },

  methods: {
    editorInit({ editor }){
      this.editor = editor
    },

    clear(){
      this.editor.clearContent()
    }
  },
}
</script>

<style>
.tiptap-vuetify-editor__content{
  background-color:rgb(51, 51, 51);
}

.tiptap-vuetify-editor__content blockquote{
  color:white;
}

.tiptap-vuetify-editor__content li > p:first-child {
  display: inline;
}
</style>