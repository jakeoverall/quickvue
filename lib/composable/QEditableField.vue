<template>
  <div>
    <label :for="label">
      <div class="d-flex align-items-center bg-dark rounded">
        <QCheckbox v-model="editing"
                   :label="(editing ? 'See Preview': 'Edit ' + label)"
                   class="pr-2 bg-dark square-right"
                   :pre="true"
        />
        <QBtn class="ml-1 text-white square-left" @click="change" v-if="!editing">
          <QIcon icon="mdi-content-save f-10" />
        </QBtn>
      </div>
    </label>
    <QMarkdown v-model="editable"
               class="scrollable show-scroll"
               rows="4"
               v-bind="$attrs"
               :placeholder="label"
               :edit="editing"
               :id="label"
    />
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

export default {
  props: {
    modelValue: { type: [String, Number], required: true },
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'save'],
  inheritAttrs: false,
  setup(props, { emit }) {
    const editable = ref('')
    const editing = ref(false)
    watchEffect(() => {
      editable.value = props.modelValue.toString()
    })
    return {
      editable,
      editing,
      change() {
        emit('update:modelValue', editable.value)
        emit('save', editable.value)
      }
    }
  }
}
</script>

<style>

</style>
