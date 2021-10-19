<template>
  <div class="card" v-if="file">
    <QList class="text-dark lighten-20 no-select" @click="close">
      <QListItem class="selectable" @click="download">
        <QIcon icon="mdi-download mx-3 text-muted" />
        <span>Download</span>
      </QListItem>
      <QDialogCard>
        <QListItem class="selectable">
          <QIcon icon="mdi-information-outline mx-3 text-muted" />
          <span>Details</span>
        </QListItem>
        <template #expanded>
          <DriveFileDetails :file="file" />
        </template>
      </QDialogCard>
      <div v-if="multiple.length == 1">
        <hr class="m-1" />
        <QListItem class="selectable" @click="copyLink(file.url)">
          <QIcon icon="mdi-link mx-3 text-muted" />
          <span>Copy Link</span>
        </QListItem>
      </div>

      <hr class="m-1" />
      <QListItem class="selectable" @click="removeFile">
        <QIcon icon="mdi-delete mx-3 text-muted" />
        <span>Delete</span>
      </QListItem>
    </QList>
  </div>
</template>

<script>
import { reactive, ref, computed } from '@vue/reactivity'
import { dateFilter } from '../DateFilters'
import { DriveService, selectedFiles } from './DriveService'
import { UTILS } from '../utils'

export default {
  props: {
    close: { type: Function, required: true }
  },
  setup(props) {
    const multiple = computed(() => Object.values(selectedFiles.value))
    const file = computed(() => multiple.value[0])
    const downloadLink = ref(null)
    const downloadUrl = ref('')
    const progress = ref({ percentage: 0 })
    return reactive({
      file,
      dateFilter,
      multiple,
      downloadLink,
      downloadUrl,
      progress,
      copyLink(url) {
        UTILS.$copyToClipboard(url)
      },
      async removeFile() {
        DriveService.removeFiles(multiple.value)
      },
      async download() {
        if (multiple.value.length === 1) {
          return await DriveService.saveFile(multiple.value[0])
        }
        const filename = await UTILS.$prompt(`Save As Please specify the filename, Compressing ${multiple.value.length} files this may take a few moments`)
        if (!filename) { return }
        DriveService.generateZip(multiple.value, filename)
      },
      async moveFiles(folder) {
        await DriveService.moveFiles(folder.path)
      }
    })
  }
}
</script>

<style>
</style>
