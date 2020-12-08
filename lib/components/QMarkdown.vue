<template>
  <div>
    <div
      class="markdown card p-2 mb-2 elevation-4"
      v-html="parseMarkdown(mdString)"
    ></div>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import DOMpurify from 'dompurify'
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    return hljs.highlight(validLanguage, code).value
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})
export default {
  name: 'Markdown',
  props: {
    mdString: {
      type: String,
      required: true,
      default: ''
    },
    customStyles: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      parseMarkdown(mdString) {
        return DOMpurify.sanitize(marked(mdString) + `<style> ${props.customStyles} </style>`)
      }
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
@import url('~highlight.js/styles/atom-one-light.css');
.outline{
  height: 8vh;
  overflow-y: hidden;
}
.current{
  height: 50vh;
  overflow-y: hidden;
}
h1{
  text-align: left !important;
  color: red !important
}
img {
  max-width: 100vw;
}
</style>
