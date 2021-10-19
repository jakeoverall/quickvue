<template>
  <div class="directory-content h-100 w-100">
    <div class="directory-content folder-files h-100">
      <div class="scrollable-y show-scroll scrollable-area">
        <div class="folders scrollable-x" @click="clearSelection">
          <router-link class="folder d-flex m-2 border rounded no-select elevation-1 bg-white" v-for="f in folder.folders" :key="f.displayName" :to="{name: 'Drive', params: {key:f.path}}">
            <div class="clip-text rounded-bottom w-100 text-left p-3" dropzone="files" @drop.prevent="moveFiles(f)">
              <div class="foldername d-flex align-items-center text-dark lighten-10">
                <QIcon icon="mdi-folder" />
                <span class="ml-3 clip-text">{{ f.name }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <QContextMenu class="files pb-4">
          <template #trigger="{open, close}">
            <DriveFile v-for="file in folder.files"
                       :key="file.name"
                       :file="file"
                       @click.stop="close();hilightFile(file)"
                       @dblclick.stop="close();selectFile(file)"
                       @contextmenu.stop="hilightFile(file); open({file, files: selectedFiles})"
                       :class="{'selected-file': selectedFiles[file.path]}"
                       :id="file.path"
                       class="selectable-file hover-card"
                       :draggable="selectedFiles[file.path] ? true : false"
                       @dragstart="onDragStart"
                       @dragend="onDragEnd"
                       @dragover.prevent
            />
          </template>
          <template #menu="{close}">
            <DriveFileContextMenu :close="close" />
          </template>
        </QContextMenu>
      </div>
      <div class="folder-details p-1 px-4 border-top bg-orange darken-10 w-100">
        <small class="d-flex align-items-center justify-content-between">
          <div v-if="selected.length > 1">
            <b>Selected Files {{ selected.length }}</b>
          </div>
          <div>
            <b>
              Files: {{ folder.files.length }}, Size {{ totalSizeMb }} Mb
            </b>
          </div>
        </small>
      </div>
    </div>
    <div ref="ghostImg" class="ghost-img p-3 bg-dark text-white rounded elevation-4">
      <QIcon icon="mdi-file-document" />
      <span class="ml-3 clip-text">Moving {{ selected.length }} Files</span>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from '@vue/runtime-core'
import { Logger } from '../monitoring/Logger'
import { DriveService, selectedFiles } from './DriveService'

export default {
  props: {
    folder: {
      type: Object,
      default() {
        return {
          path: '',
          name: '',
          files: [],
          folders: []
        }
      }
    },
    drive: { type: Object, required: true }
  },
  emits: ['select-file', 'set-folder'],
  setup(props, { emit }) {
    const ghostImg = ref(null)
    const selected = computed(() => Object.values(selectedFiles.value))
    const totalSizeMb = computed(() => props.folder.files.reduce((acc, f) => acc + f.sizeMb, 0).toFixed(1))

    return reactive({
      selectedFiles,
      selected,
      totalSizeMb,
      ghostImg,
      selectFile(file) {
        emit('select-file', file)
      },
      hilightFile(file) {
        if (selected.value.length > 1 && event.type === 'contextmenu') {
          selectedFiles.value[file.path] = file
          return
        }
        if (selectedFiles.value[file.path] && event.type !== 'contextmenu') {
          delete selectedFiles.value[file.path]
          return
        }
        if (event.shiftKey || event.ctrlKey) {
          selectedFiles.value[file.path] = file
          return
        }
        selectedFiles.value = {}
        selectedFiles.value[file.path] = file
      },
      clearSelection() {
        selectedFiles.value = {}
      },
      setFolder(folder) {
        emit('set-folder', folder)
      },
      onDragStart() {
        Logger.log('dragstart', selected.value)
        // ghostImg.value.classList.remove('drag-only')
        event.dataTransfer.setDragImage(ghostImg.value, 0, 0)
      },
      onDragEnd() {
        // ghostImg.value.classList.add('drag-only')
      },
      async moveFiles(folder) {
        await DriveService.moveFiles(folder.path)
      }
    })
  }
}
</script>

<style lang="scss">

.scrollable-area {
  height: 75vh;
}

.selected-file{
  border: 1px solid #008cff !important;
  background: #d9eeff;
  color: #001e36;
}

.content-view-cards .folder{
  flex-direction: column;
  justify-content: center;
  position:relative;
  max-width: 280px;
  img {
    height: 280px;
    width: 280px;
  }
}
.folder{
  align-items: center;
  img {
    height: 60px;
    width: 60px;
  }
}

.content-view-details .folder img {
  display: none;
}

.ghost-img{
  transition: all .15s linear;
  position:fixed;
  pointer-events: none;
  transform: translateX(-300px);
  width: 250px;
  height: 60px;
  z-index: 2;
}

.folder-details{
  position: sticky;
  bottom: 0;
  z-index: 1;
}

</style>
