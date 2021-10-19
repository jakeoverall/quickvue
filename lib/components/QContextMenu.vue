<template>
  <div>
    <slot name="trigger" :open="open" :close="() => close()" />
    <div
      class="context-menu elevation-4"
      ref="contextMenu"
      v-show="opened"
      tabindex="-1"
      :style="{ left: menuStyles.left + 'px', top: menuStyles.top + 'px' }"
    >
      <slot name="menu" :close="() => close()" :payload="payload" />
    </div>
  </div>
</template>

<script>

import { onBeforeUnmount, reactive, ref } from '@vue/reactivity'

export default {
  setup() {
    const opened = ref(false)
    const contextMenu = ref()
    const menuStyles = ref({})
    const payload = ref({})

    function closeOnClickOutside(e) {
      if (opened.value && !contextMenu.value.contains(e.target)) {
        close()
      }
    }
    function close() {
      opened.value = false
      document.removeEventListener('click', closeOnClickOutside)
    }
    onBeforeUnmount(close)

    return reactive({
      opened,
      menuStyles,
      contextMenu,
      close,
      payload,
      open(p) {
        const evt = event
        evt.preventDefault()
        evt.stopImmediatePropagation()
        evt.stopPropagation()
        payload.value = p
        opened.value = true
        let left = evt.clientX
        let top = evt.clientY
        if (window.screen.width < left + contextMenu.value.scrollWidth + 250) {
          left -= contextMenu.value.scrollWidth
        }
        if (window.screen.height < top + contextMenu.value.scrollHeight + 250) {
          top -= contextMenu.value.scrollHeight
        }

        document.addEventListener('click', closeOnClickOutside)
        document.addEventListener('contextmenu', closeOnClickOutside)

        menuStyles.value = {
          left,
          top
        }
      }

    })
  }
}

</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  z-index: 999;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  min-width: 200px;
  max-width: 500px;
  max-height: 500px;
  overflow: auto;
  &:focus {
    outline: none;
  }
  ul {
    padding: 0px;
    margin: 0px;
  }
}
</style>
