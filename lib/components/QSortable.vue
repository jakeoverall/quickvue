<template>
  <div class="sortable" dropzone="sortable" @dragover.prevent>
    <div v-for="(item, i) in items"
         :key="item.id"
         draggable="true"
         @dragstart="onDragStart(i)"
         @dragover.prevent="onDragOver(i)"
         @dragend.prevent="onDragEnd"
         @drop.prevent="onDrop"
    >
      <slot name="items" :item="item" />
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from 'vue'
export default {
  props: {
    items: { type: Array, default: () => [] }
  },
  emits: ['save'],
  setup(props, { emit }) {
    let dragging = null
    let nextPos = null
    let nextElem = null
    const list = ref([])
    watchEffect(() => {
      list.value = props.items
    })
    function save() {
      emit('save', list.value)
    }
    return reactive({
      nextPos,
      onDragOver(i) {
        if (i === nextPos) { return }
        nextPos = i
        if (nextElem) {
          nextElem.classList.remove('enter-left', 'enter-right')
        }
        nextElem = event.srcElement
        nextElem.classList.add(i <= dragging ? 'enter-left' : 'enter-right')
      },
      onDragStart(i) {
        dragging = i
        event.target.classList.add('dragging')
      },
      onDrop() {
        if (nextPos === dragging) {
          nextPos = null
          dragging = null
          return
        }
        const dropedComponent = list.value.splice(dragging, 1)[0]
        if (!dropedComponent) { return }
        list.value.splice(nextPos, 0, dropedComponent)
        nextPos = null
        dragging = null
        save()
      },
      onDragEnd() {
        event.target.classList.remove('dragging')
        if (nextElem) {
          nextElem.classList.remove('enter-left', 'enter-right')
          nextElem = null
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">
.sortable{
  display: flex;
  flex-wrap: wrap;
  div{
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.2s linear;
    &.dragging {
      transform: scale(0.9) rotateZ(.5deg);
      opacity: 0.3;
      outline: 1px dashed rgba(128, 128, 128, 0.507);
    }
    &.enter-left {
      transform: translateX(5px) rotateZ(.5deg);
      border-left: 5px dashed rgba(128, 128, 128, 0.507);
    }
    &.enter-right {
      transform: translateX(-5px) rotateZ(-.5deg);
      border-right: 5px dashed rgba(128, 128, 128, 0.507);
    }
  }
}
</style>
