<template>
  <div class="w-100" :class="{'no-select': noSelect}">
    <label v-if="label">{{ label }}</label>
    <div class="d-flex align-items-center position-relative input-container" :class="{insetIconP, insetIconA, asSelect}">
      <QIcon class="prepended-icon" :icon="prependIcon" v-if="prependIcon" />
      <input
        class="form-control"
        v-bind="$attrs"
        type="date"
        :value="formatDate()"
        @change="change()"
      />
      <QIcon class="appended-icon" :icon="appendIcon" v-if="appendIcon" />
    </div>
    <transition name="fade">
      <sup class="m-1" v-if="hint">{{ hint }}</sup>
    </transition>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    noSelect: { type: Boolean, default: false },
    asSelect: { type: Boolean, default: false },
    insetIconA: { type: Boolean, default: false },
    insetIconP: { type: Boolean, default: false },
    label: { type: String, default: '' },
    prependIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    hint: { type: String, default: '' },
    modelValue: { type: [String, Number, Boolean], default: '' }
  },
  methods: {
    change() {
      this.$emit('update:modelValue', event.target.value)
    },
    formatDate() {
      try {
        return new Date(this.modelValue).toISOString().slice(0, 10)
      } catch (e) {
        return new Date().toISOString().slice(0, 10)
      }
    }
  }
}
</script>

<style scoped lang="scss">

.input-container{
  &.insetIconP{
    input{
      padding-left: 30px;
    }
    .prepended-icon{
      position: absolute;
    }
  }
  &.insetIconA{
    input{
      padding-right: 40px;
    }
    .appended-icon{
      transform: translateX(-34px);
    }
  }
  &.asSelect{
    cursor: pointer;
    &:hover{
      .appended-icon{
        opacity: .8;
      }
    }
    input{
      cursor: pointer;
      padding-right: 40px;
      background-color: white;
    }
    .appended-icon{
      opacity: .5;
    }
  }
}
label{
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  height: 20px;
  line-height: 20px;
  opacity: .75;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0;
}

</style>
