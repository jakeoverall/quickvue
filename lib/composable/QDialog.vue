<template>
  <div class="dialog-container" v-if="open">
    <div class="content-elem" ref="contentElem" :class="{'flex-grow-1 w-100 fullscreen':fullscreen}" :style="{'min-width': minWidth}">
      <div class="dialog-body h-100">
        <div class="rounded elevation-4 h-100" :class="dark ? 'bg-dark' : 'bg-white'">
          <div class="border-bottom" :class="dark ? 'bg-dark border-dark' : ''">
            <div class="p-3 mx-4 d-flex align-items-center justify-content-between">
              <slot name="header" />
              <QBtn icon @click="close" class="f-20" :class="dark ? 'bg-dark text-white' : ''">
                <QIcon icon="mdi-close" />
              </QBtn>
            </div>
            <slot name="tabs" :close="()=> close()" />
          </div>

          <div class="dialog-content card-body scrollable-y show-scroll" :class="dark ? 'bg-dark lighten-20' : 'bg-light'">
            <slot :close="()=> close()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watchEffect } from '@vue/runtime-core'

export default {
  props: {
    open: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    transition: { type: String, default: 'fade' },
    title: { type: String, default: '' },
    theme: { type: String, default: 'bg-primary text-light' },
    minWidth: { type: String, default: '35vw' }
  },
  emits: ['close'],
  setup(props, { emit }) {
    let root = null
    const contentElem = ref(null)
    const ready = ref(false)

    onMounted(getOrCreateModalRoot)
    onBeforeUnmount(removeHandlers)

    watchEffect(() => {
      if (props.open) {
        document.body.classList.add('ex-overlay')
      } else {
        document.body.classList.remove('ex-overlay')
      }
    })

    function checkClickOutside(e) {
      try {
        if (props.open && !props.persistent && !contentElem.value.contains(e.target)) {
          close()
        }
      } catch (e) {}
    }
    function checkEsc(e) {
      try {
        if (props.open && e.which === 27 && !props.persistent) {
          close()
        }
      } catch (e) {}
    }

    function removeHandlers() {
      try {
        root.removeEventListener('click', checkClickOutside)
        document.removeEventListener('keydown', checkEsc)
        close()
      } catch (e) {}
    }

    function getOrCreateModalRoot() {
      try {
        root = document.querySelector('#root-dialog')
        if (!root) {
          root = document.createElement('div')
          root.id = 'root-dialog'
          document.body.appendChild(root)
        }
        ready.value = true
        root.addEventListener('click', checkClickOutside)
        window.addEventListener('keydown', checkEsc)
      } catch (e) {}
    }

    function close() {
      try {
        emit('close')
        document.body.classList.remove('ex-overlay')
      } catch (e) {}
    }

    return {
      contentElem,
      close,
      ready
    }
  }
}
</script>

<style scoped lang="scss">
@keyframes open{
  0%{
    transform: scale(0);
  }
  100%{
    transform: scale(1);
  }
}
.dialog-container {
  position: fixed;
  top:0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0,0,0,.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9;
  .content-elem{
    animation: open .15s linear;
    max-width: 90vw;
    max-height: 90vh
  }
  .dialog-content{
    min-width: var(--minWidth);
    max-height: calc(90vh - 80px);
  }
}

@media screen AND (max-width: 768px) {
  .dialog-container{
    .content-elem{
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      .dialog-content{
        max-height: calc(100vh - 80px);
      }
    }
    .dialog-content{
      width: 100%;
      height: 100%;
      border-radius: 0 !important;
    }
  }
}

</style>
