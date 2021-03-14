<template>
  <div
    class="expandable-card"
    :class="{expanded}"
    @click="expand(true)"
  >
    <div class="trigger">
      <slot />
    </div>
    <Teleport to="#root-dialog">
      <transition name="fade">
        <div class="expanded-card" :class="[dialogClass, {'maximize': isMobile}]" v-if="expanded">
          <QBtn class="icon fab close-button" :class="closeClass" top="12vh" right="12vw" @click.stop="expand(false)">
            <QIcon icon="mdi-close" />
          </QBtn>
          <slot name="expanded" :close="()=>expand(false)"></slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import { UTILS } from '../utils'

export default {
  props: {
    closeClass: { type: String, default: '' },
    dialogClass: { type: String, default: '' }
  },
  setup() {
    let root = document.querySelector('#root-dialog')
    const expanded = ref(false)
    onBeforeMount(getOrCreateModalRoot)
    onBeforeUnmount(() => {
      document.body.classList.remove('ex-overlay')
    })
    function getOrCreateModalRoot() {
      if (!root) {
        root = document.createElement('div')
        root.id = 'root-dialog'
        document.body.appendChild(root)
      }
    }
    return reactive({
      expanded,
      isMobile: computed(() => UTILS.isMobile),
      expand(val) {
        expanded.value = val
        if (expanded.value) {
          document.body.classList.add('ex-overlay')
        } else {
          document.body.classList.remove('ex-overlay')
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.expandable-card{
  transition: all .3s linear;
  &.expanded{
    .trigger{
      position: fixed;
      opacity: 0;
      transform: scale(0);
    }
  }
  .trigger{
    transition: all .3s linear;
    transform: scale(1);
  }
}
.expanded-card{
  position: fixed;
  transition: all .3s linear;
  overflow-y: auto;
  top: 10vh;
  right: 10vw;
  width: 80vw;
  height: 80vh;
  z-index: 1;
  &.maximize{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    .close-button{
      top: 2vh !important;
      right: 2vh !important;
      z-index: 5;
    }
  }
}
</style>
<style lang="scss">
.ex-overlay {
  overflow: hidden !important;
  &::before{
      content: '';
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.25);
      pointer-events: all;
      z-index: 1;
    }
}
</style>
