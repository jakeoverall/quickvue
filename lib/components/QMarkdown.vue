<template>
  <div>
    <div
      class="markdown"
      v-html="parseMarkdown()"
      v-if="!edit"
    ></div>
    <textarea
      v-else
      @input="change"
      @blur="blur"
      :value="modelValue"
    ></textarea>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import DOMpurify from 'dompurify'
import { UTILS } from '../utils'

export default {
  props: {
    edit: { type: Boolean, default: false },
    debouce: { type: Number, default: 750 },
    modelValue: {
      type: String,
      required: true,
      default: ''
    },
    config: {
      type: Object,
      default: () => {
        return {
          renderer: new marked.Renderer(),
          pedantic: false,
          gfm: true,
          breaks: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: false
        }
      }
    },
    highlighter: {
      type: Function,
      default: () => {
        return function(code, language) {
          const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
          return hljs.highlight(validLanguage, code).value
        }
      }
    },
    customStyles: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    marked.setOptions({ highlight: props.highlighter, ...props.config })
    function fire() {
      emit('update:modelValue', event.target.value)
    }
    return {
      parseMarkdown() {
        return DOMpurify.sanitize(marked(props.modelValue) + `<style> ${props.customStyles} </style>`)
      },
      change() {
        UTILS.$debounce(fire, props.debounce)
      },
      blur() {
        emit('update:modelValue', event.target.value.trim())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('~highlight.js/styles/atom-one-light.css');
.markdown{
  img {
    max-width: 100%;
  }
}
</style>
