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
        <div class="expanded-card" :class="dialogClass" v-if="expanded">
          <QBtn class="icon fab" :class="closeClass" top="12vh" right="12vw" @click.stop="expand(false)">
            <QIcon icon="mdi-close" />
          </QBtn>
          <slot name="expanded"></slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'

export default {
  props: {
    closeClass: { type: String, default: '' },
    dialogClass: { type: String, default: '' }
  },
  setup() {
    let root = document.querySelector('#root-dialog')
    const expanded = ref(false)
    onBeforeMount(getOrCreateModalRoot)
    function getOrCreateModalRoot() {
      if (!root) {
        root = document.createElement('div')
        root.id = 'root-dialog'
        document.body.appendChild(root)
      }
    }
    return reactive({
      expanded,
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
