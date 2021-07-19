<template>
  <div>
    <h1>QuickVue Docs</h1>
    <QBtn @click="showSimple = true">
      open modal
    </QBtn>

    <QDialogCard>
      <div>
        some content here
      </div>
      <template #trigger>
        click me
      </template>
    </QDialogCard>

    <QDialog :open="showSimple" @close="showSimple = false">
      <div>
        this is a simple modal
      </div>
    </QDialog>

    <QBtn @click="editMD = !editMD">
      {{ editMD ? 'Preview': 'Edit' }}
    </QBtn>
    <QMarkdown v-model="mdExample" :edit="editMD"></QMarkdown>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
  name: 'Home',
  setup() {
    return reactive({
      showSimple: false,
      editMD: false,
      mdExample: '## Hello World'
    })
  }
}
</script>

<style scoped lang="scss">

</style>
