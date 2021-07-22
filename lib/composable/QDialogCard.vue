<template>
  <div
    class="expandable-card"
    :class="{expanded}"
    @click="expand(true)"
  >
    <div class="trigger">
      <slot />
    </div>
    <div v-if="expanded">
      <XDialog :open="expanded"
               @close="expanded = false"
               :min-width="minWidth"
               :fullscreen="fullscreen"
               :persistent="persistent"
               :dark="dark"
      >
        <template #header>
          <slot name="header" />
        </template>
        <template #default>
          <slot name="expanded" />
        </template>
      </XDialog>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

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
      if (expanded.value) {
        document.body.classList.add('ex-overlay')
      } else {
        document.body.classList.remove('ex-overlay')
      }
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
