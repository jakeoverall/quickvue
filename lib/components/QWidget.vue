<template>
  <div class="widget-card" :class="[{'maximize': max, 'minimize': min}, !max ? col : '']">
    <div class="widget-toolbar d-flex align-items-center justify-content-between" :class="toolbar">
      <slot name="widget-toolbar" :min="min" :max="max" :size="size">
        <div class="clip-text w-90">
          <b class="text-uppercase">{{ title }}</b>
        </div>
        <div class="d-flex">
          <QMenu close-on-click v-if="!max">
            <template #trigger>
              <QBtn><QIcon icon="mdi-select-place text-light" /></QBtn>
            </template>
            <input type="range"
                   step="1"
                   min="0"
                   :max="cols.length-1"
                   :value="size"
                   @change="setSize"
            >
          </QMenu>
          <QBtn class="icon mx-2 text-light" @click="minimize">
            <QIcon icon="mdi-minus" />
          </QBtn>
          <QBtn class="icon mx-2 text-light" @click="maximize" v-if="!max">
            <QIcon icon="mdi-window-maximize" />
          </QBtn>
        </div>
      </slot>
    </div>
    <div class="widget-body elevation-2 bg-white rounded-bottom scrollable-y scrollable-x show-scroll d-flex flex-column justify-content-between">
      <slot :min="min" :max="max" :size="size" />
      <div class="widget-footer">
        <slot name="footer" :min="min" :max="max" :size="size" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
export default {
  props: {
    title: { type: String, default: '' },
    toolbar: { type: String, default: 'p-2 bg-purple darken-40' }
  },
  setup(props) {
    const max = ref(false)
    const min = ref(false)
    const size = ref(localStorage.getItem(props.title) || 2)
    const cols = [
      'col-lg-3',
      'col-lg-4',
      'col-lg-6',
      'col-lg-8',
      'col-lg-12'
    ]
    return reactive({
      max,
      min,
      cols,
      size,
      col: computed(() => cols[size.value]),
      maximize() {
        if (min.value) {
          min.value = false
          return
        }
        max.value = !max.value
      },
      minimize() {
        if (max.value) {
          max.value = false
          return
        }
        min.value = !min.value
      },
      setSize(e) {
        size.value = e.target.value
        localStorage.setItem('___widget__' + props.title, size.value)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.widget-card{
  transition: all .23s linear;
  &.maximize{
    z-index: 3;
    position: fixed;
    width: 100vw;
    min-height: 100vh;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .widget-body{
      min-height: 95%;
      width: 100vw;
    }
  }
  &.minimize .widget-body{
    transform: scaleY(0);
  }
  &:not(.maximize) .widget-toolbar{
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }
  .widget-body{
    transform-origin: top;
    transition: all .23s linear;
    position: relative;
    min-height: 250px;
    max-height: 500px;
    .widget-footer{
      position: sticky;
      bottom: 0;
    }
  }
}
</style>
