<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <div
        @click="show = !show"
        class="d-flex align-items-center flex-grow-1 action muted no-select w-100"
        :class="titleClass"
        :style="titleStyle"
      >
        <slot name="trigger" :show="show">
          <QIcon
            class="mr-2"
            :class="{'mdi-chevron-down': !show, 'mdi-minus': show}"
          />
          <h5 class="m-0">
            {{ title }}
          </h5>
        </slot>
      </div>
      <div v-if="add" class="action muted" @click="showForm = !showForm">
        <QIcon class="ml-1" :icon="showForm ? addIcons.close : addIcons.open" />
      </div>
    </div>
    <div class="slide-down w-100" :class="{'open flex-grow-1': showForm}">
      <slot name="form"></slot>
    </div>
    <div class="slide-down w-100" :class="{'open flex-grow-1': show}">
      <slot v-if="show"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickCollapse',
  props: {
    title: { type: String, default: '' },
    open: Boolean,
    add: Boolean,
    addIcons: {
      type: Object,
      default() {
        return { open: 'mdi-plus', close: 'mdi-minus' }
      }
    },
    titleClass: { type: String, default: '' },
    titleStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      showForm: false
    }
  },
  watch: {
    open: {
      handler(val) {
        this.show = val
      },
      immediate: true
    }
  }
}
</script>

<style>
.action{
  cursor: pointer;
  transition: all .3s linear;
}
.no-select{
  user-select: none;
}
.slide-down {
  overflow: hidden;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-down.open {
  transition: 0.3s ease-in;
  overflow: auto;
  max-height: 100vh;
}

.slide-down::-webkit-scrollbar{
  width: 0;
}

</style>
