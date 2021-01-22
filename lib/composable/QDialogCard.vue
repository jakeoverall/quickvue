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
      <div class="expando-content">
        <QBtn class="icon fab" top="1rem" right="1rem" @click.stop="expand(false)">
          <QIcon icon="mdi-close" />
        </QBtn>
        <slot name="expanded" :expanded="expanded" v-if="expanded"></slot>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'

export default {
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
    .expando-content{
      transform-origin: center;
      transform: scale(1);
      pointer-events: all;
    }
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
  .expando-content{
    transition: all .3s linear;
    position: fixed;
    top: 10vh;
    right: 10vw;
    width: 80vw;
    height: 80vh;
    z-index: 1;
    transform: scale(0);
    overflow-y: auto;
    pointer-events: none;
    > div {
      height: 100%;
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
