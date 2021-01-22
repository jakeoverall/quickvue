<template>
  <Teleport to="#root-dialog">
    <Transition :name="transition">
      <div class="dialog-container" :class="{open}" v-if="open">
        <div class="elevation-4 dialog-content" ref="contentElem" :class="{'flex-grow-1 w-100 fullscreen':fullscreen, 'rounded': !fullscreen}" :style="{'min-width': minWidth}">
          <div class="dialog-header">
            <slot name="header">
              <div class="p-2 w-100 d-flex align-items-center justify-content-between" v-if="!noHeader" :class="[{ 'rounded-top': !fullscreen}, theme]">
                <span class="dialog-title clip-text">
                  {{ title }}
                </span>
                <QBtn class="icon text-light stroke" @click="close">
                  <QIcon icon="mdi-close" />
                </QBtn>
              </div>
            </slot>
          </div>
          <div class="scrollable-y show-scroll dialog-body">
            <slot />
          </div>
          <div class="dialog-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
const { onBeforeMount, onBeforeUnmount, ref, watchEffect } = require('vue')
export default {
  props: {
    open: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    noHeader: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
    transition: { type: String, default: 'fade' },
    title: { type: String, default: '' },
    theme: { type: String, default: 'bg-primary text-light' },
    minWidth: { type: String, default: '35vw' }
  },
  emits: ['close'],
  setup(props, { emit }) {
    let root = document.querySelector('#root-dialog')
    const contentElem = ref(null)
    onBeforeMount(getOrCreateModalRoot)
    onBeforeUnmount(removeHandlers)

    watchEffect(() => {
      if (props.open) {
        document.body.classList.add('ex-overlay')
      }
    })

    function checkClickOutside(e) {
      if (props.open && !props.persistent && !contentElem.value.contains(e.target)) {
        close()
      }
    }
    function checkEsc(e) {
      if (props.open && e.which === 27 && !props.persistent) {
        close()
      }
    }

    function removeHandlers() {
      root.removeEventListener('click', checkClickOutside)
      document.removeEventListener('keydown', checkEsc)
    }

    function getOrCreateModalRoot() {
      if (!root) {
        root = document.createElement('div')
        root.id = 'root-dialog'
        document.body.appendChild(root)
      }
      root.addEventListener('click', checkClickOutside)
      window.addEventListener('keydown', checkEsc)
    }

    function close() {
      emit('close')
      document.body.classList.remove('ex-overlay')
    }

    return {
      contentElem,
      close
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-container {
  position: fixed;
  top:0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0,0,0,.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9;
  .dialog-title{
    font-size: 1.5rem;
    font-weight: 500;
    font-family: "Roboto" sans-serif;
  }
  .dialog-content{
    background-color: white;
    min-width: var(--minWidth);
    .dialog-header{
      max-height: 10vh;
    }
    // .dialog-body{
    //   // max-height: 88vh;
    // }
    .dialog-footer:not(:empty){
      border-top: 1px solid lightgrey;
      padding: .75rem;
      max-height: 10vh;
    }
  }
}
</style>
