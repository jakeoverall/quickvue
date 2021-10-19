<template>
  <div
    class="expandable-card"
    :class="{expanded}"
  >
    <div class="trigger" @click="expand(true)">
      <slot />
    </div>
    <div v-if="expanded">
      <QDialog :open="expanded"
               @close="expanded = false"
               :min-width="minWidth"
               :fullscreen="fullscreen"
               :persistent="persistent"
               :dark="dark"
      >
        <template #header>
          <slot name="header" />
        </template>
        <template #tabs>
          <slot name="tabs" />
        </template>
        <template #default>
          <slot name="expanded" />
        </template>
      </QDialog>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'

export default {
  props: {
    persistent: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    minWidth: { type: String, default: '85vw' }
  },
  setup() {
    const expanded = ref(false)
    function expand(val) {
      expanded.value = val
    }

    return reactive({
      expanded,
      expand
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
</style>
