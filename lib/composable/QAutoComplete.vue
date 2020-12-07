<template>
  <div>
    <QMenu :close-on-click="closeOnClick">
      <template #trigger>
        <QInput v-bind="$attrs" @input="change" />
      </template>
      <QList v-if="items.length" class="card">
        <QListItem v-for="item in items" :key="item.id">
          <slot name="item" :item="item" />
        </QListItem>
      </QList>
    </QMenu>
  </div>
</template>

<script>
import { UTILS } from '../utils'
export default {
  inheritAttrs: false,
  props: {
    items: { type: Array, default: () => [] },
    debounce: { type: Number, default: 750 },
    closeOnClick: { type: Boolean, default: true }
  },
  emits: ['change'],
  methods: {
    change(e) {
      if (e.target.value) {
        UTILS.$debounce(this.fire, this.debounce)
      }
    },
    fire() {
      this.$emit('change')
    }
  }
}
</script>
