<template>
  <div
    class="__q-md-renderer__"
    v-html="formatted"
    v-if="!edit"
  ></div>
  <textarea
    v-else
    class="form-control __q-md-editor__"
    @input="change"
    @blur="blur"
    @keydown.tab.exact.prevent="onTab"
    @keydown.shift.tab.exact.prevent="onShiftTab"
    :value="modelValue"
  ></textarea>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import DOMpurify from 'dompurify'
import { UTILS } from '../utils'
import { computed, watch } from 'vue'

export default {
  props: {
    edit: { type: Boolean, default: false },
    debouce: { type: Number, default: 750 },
    minHeight: { type: Number, default: 500 },
    maxHeight: { type: Number, default: 500 },
    autoGrow: { type: Boolean, default: false },
    value: { type: String, default: '' },
    modelValue: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {
        return {
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: false,
          langPrefix: 'hljs lang-'
        }
      }
    },
    highlighter: {
      type: Function,
      default(code, language) {
        const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
        return hljs.highlight(validLanguage, code).value
      }
    },
    theme: { type: String, default: 'night-owl' },
    customStyles: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    marked.setOptions({ highlight: props.highlighter, ...props.config })
    let linkElem = document.querySelector('#hljs-theme')

    watch(() => props.theme, (old, update) => {
      if (!linkElem) {
        linkElem = document.createElement('link')
        document.body.prepend(linkElem)
        linkElem.id = 'hljs-theme'
        linkElem.rel = 'stylesheet'
      }
      linkElem.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/${props.theme}.min.css`
    }, { immediate: true })

    let md = ''
    function fire() {
      emit('update:modelValue', md)
    }

    function resize(elem) {
      if (!elem || elem.scrollHeight === 0) {
        // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
        return
      }
      const docTop = document.documentElement && document.documentElement.scrollTop

      elem.style.height = ''
      let height = elem.scrollHeight < props.maxHeight ? elem.scrollHeight : props.maxHeight
      height = height < props.minHeight ? props.minHeight : height

      elem.style.height = height + 'px'

      if (docTop) {
        document.documentElement.scrollTop = docTop
      }
    }

    return {
      formatted: computed(() => DOMpurify.sanitize(marked(props.modelValue || props.value))),
      change() {
        md = event.target.value
        UTILS.$debounce(fire, props.debounce)
        if (props.autoGrow) {
          resize(event.target)
        }
      },
      blur() {
        md = event.target.value.trim()
        fire()
      },
      onTab() {
        let text = event.target.value
        const originalSelectionStart = event.target.selectionStart
        const textStart = text.slice(0, originalSelectionStart)
        const textEnd = text.slice(originalSelectionStart)

        text = `${textStart}\t${textEnd}`
        event.target.value = text
        event.target.selectionEnd = event.target.selectionStart = originalSelectionStart + 1
      },
      onShiftTab() {
        let text = event.target.value
        const originalSelectionStart = event.target.selectionStart
        const textStart = text.slice(0, originalSelectionStart)
        const textEnd = text.slice(originalSelectionStart)
        const i = textStart.lastIndexOf('\t')
        if (i === -1) { return }
        text = `${textStart.slice(0, i)}${textEnd}`
        event.target.value = text
        event.target.selectionEnd = event.target.selectionStart = originalSelectionStart - 1
      }
    }
  }
}
</script>

<style lang="scss">
.__q-md-renderer__{
  img {
    max-width: 100%;
  }
  pre{
    border-radius: 5px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
  }
}
.__q-md-editor__{
  resize: vertical;
}
</style>
