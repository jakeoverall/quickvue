<template>
  <div class="drive-searchbar d-flex align-items-center border-bottom px-4 py-2">
    <QBtn
      class="text-dark lighten-10 p-1"
      :to="{name: 'Drive', params: {key: root}}"
      dropzone="files"
      @drop.prevent="moveFiles(root,-1)"
    >
      <b class="text-normal f-12">
        My Drive /
      </b>
    </QBtn>
    <QBtn class="text-dark lighten-10 p-1"
          v-for="(link,i) in crumbs"
          :key="link.path"
          :to="{name: 'Drive', params: {key: link.path}}"
          dropzone="files"
          @drop.prevent="moveFiles(link.path, i)"
    >
      <QIcon class="mr-2" :icon="i === crumbs.length-1 ? 'mdi-folder-open': 'mdi-folder'" />
      <b class="text-normal f-12">
        {{ link.name }} /
      </b>
    </QBtn>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { DriveService } from './DriveService'
export default {
  props: {
    path: { type: String, required: true },
    drive: { type: Object, required: true },
    root: { type: String, required: true }
  },
  setup(props) {
    const crumbs = computed(() => props.path.split('/')
      .filter(k => {
        const i = props.path.indexOf(k)
        if (i === -1 || i === 0) { return false }
        const key = props.path.slice(0, i + k.length + 1)
        return props.drive.structure[key]
      })
      .map(k => {
        const i = props.path.indexOf(k)
        const key = props.path.slice(0, i + k.length + 1)
        return props.drive.structure[key]
      })
    )
    return reactive({
      crumbs,
      async moveFiles(to, i) {
        if (crumbs.value.length === 0) { return }
        if (i === crumbs.value.length - 1) { return }
        await DriveService.moveFiles(to)
      }
    })
  }
}
</script>

<style scoped lang="scss">
.text-normal{
  text-transform: none !important;
}
.drive-searchbar a:last-child{
  border-bottom: 3px solid var(--primary);
  border-radius: 0;
}
</style>
