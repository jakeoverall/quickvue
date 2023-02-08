<template>
  <div class="expandable-card" :class="{ expanded }">
    <div class="trigger" @click="() => x(true)">
      <slot />
    </div>
    <div v-if="expanded">
      <XDialog :open="expanded" @close="expanded = false" :min-width="minWidth" :fullscreen="fullscreen"
        :persistent="persistent" :dark="dark" :title="title">
        <template #header>
          <slot name="header" />
        </template>
        <template #tabs>
          <slot name="tabs" />
        </template>
        <template #default>
          <slot name="expanded" />
        </template>
      </XDialog>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    persistent: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    title: { type: String, default: 'close' },
    minWidth: { type: String, default: '85vw' }
  },
  setup() {
    const expanded = ref(false)
    function x(val) {
      expanded.value = val
    }

    return {
      expanded,
      x
    }
  }
}
</script>

<style lang="scss" scoped>
.expandable-card {
  transition: all .3s linear;

  &.expanded {
    .trigger {
      position: fixed;
      opacity: 0;
      transform: scale(0);
    }
  }

  .trigger {
    transition: all .3s linear;
    transform: scale(1);
  }
}
</style>
