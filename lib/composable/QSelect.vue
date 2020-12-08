<template>
  <QMenu close-on-click :offset-y="hint ? '-1.9rem':''">
    <template #trigger>
      <QInput
        no-select
        as-select
        readonly
        v-model="state.display"
        :inset-icon-p="insetIconP"
        :inset-icon-a="insetIconA"
        :prepend-icon="prependIcon"
        :append-icon="appendIcon"
        :hint="hint"
        :label="label"
        v-bind="$attrs"
      />
    </template>
    <QList class="card scrollable-y no-select">
      <QListItem class="selectable w-100" v-for="(item,i) in items" :key="item.id ? item.id : item+i" @click="onSelect(item)">
        {{ item[itemText] ? item[itemText]: item }}
      </QListItem>
    </QList>
  </QMenu>
</template>

<script>
import { reactive, computed } from 'vue'
export default {
  props: {
    selected: { type: [Object, String, Number], default: () => null },
    items: { type: Array, default: () => [] },
    itemText: { type: String, default: 'name' },
    insetIconA: { type: Boolean, default: true },
    insetIconP: { type: Boolean, default: false },
    label: { type: String, default: '' },
    prependIcon: { type: String, default: '' },
    appendIcon: { type: String, default: 'mdi-chevron-down' },
    hint: { type: String, default: '' }
  },
  emits: ['select'],
  inheritAttrs: false,
  setup(props, context) {
    const state = reactive({
      display: computed(() => {
        const label = typeof props.selected === 'string' || typeof props.selected === 'number' ? props.selected : ''
        return props.selected ? props.selected[props.itemText] ? props.selected[props.itemText] : label : ''
      })
    })
    return {
      state,
      onSelect(item) {
        context.emit('select', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectable{
  background-color: inherit;
  transition: background-color .15s linear;
  &:hover{
    background-color: var(--grey);
    cursor: pointer;
    border-radius: 0;
  }
}
</style>
