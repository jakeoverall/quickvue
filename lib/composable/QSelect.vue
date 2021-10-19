<template>
  <QMenu close-on-click :offset-y="hint ? '-1.9rem' : ''">
    <template #trigger>
      <QInput
        no-select
        as-select
        readonly
        v-model="display"
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
      <QListItem
        class="selectable w-100"
        v-for="(item, i) in items"
        :key="item.id ? item.id : item + i"
        @click="onSelect(item)"
      >
        <slot name="item" :item="item">
          {{ item[itemText] ? item[itemText] : item }}
        </slot>
      </QListItem>
    </QList>
  </QMenu>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

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
    const display = ref('')
    watchEffect(() => {
      display.value = props.selected ? props.selected[props.itemText] : props.selected
    })
    return {
      display,
      onSelect(item) {
        context.emit('select', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectable {
  background-color: inherit;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: var(--grey);
    cursor: pointer;
    border-radius: 0;
  }
}
</style>
