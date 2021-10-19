<template>
  <kbd @click="change">
    <div class="check-light" :class="editable ? onClass:offClass" v-if="pre"></div>
    <span>{{ label }}</span>
    <div class="check-light" :class="editable ? onClass:offClass" v-if="!pre"></div>
  </kbd>
</template>

<script>
import { ref, watchEffect } from '@vue/reactivity'
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: 'ON' },
    onClass: { type: String, default: 'check-on' },
    offClass: { type: String, default: 'check-off' },
    pre: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editable = ref(false)
    watchEffect(() => {
      editable.value = props.modelValue
    })
    return {
      editable,
      change() {
        editable.value = !editable.value
        emit('update:modelValue', editable.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
kbd {
  user-select: none;
  display: flex;
  align-items: center;
  line-height: 1.25rem;
  font-size: 75%;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  .check-light{
    height: 8px;
    width: 8px;
    border-radius: 50%;
    transition: all .3s linear;
    margin: 0 .5rem;

  }
  .check-on{
    background-color: rgb(0, 255, 0);
    box-shadow: 0 0 2px 1px rgb(0, 0, 0), 0 0 1px 2px rgb(0, 255, 0);
  }
  .check-off-red{
    background-color: rgb(255, 20, 20);
    box-shadow: 0 0 2px 1px rgb(0, 0, 0), 0 0 1px 2px rgb(255, 25, 25);
  }
  .check-off{
    background-color: black;
    box-shadow: 0 0 2px 1px white;
  }
  &:hover{
    cursor: pointer;
    &:before{
      opacity: .1;
    }
  }
  &:before{
    border-radius: inherit;
    bottom: 0;
    color: inherit;
    content: "";
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    background-color: currentColor;
  }
}
</style>
