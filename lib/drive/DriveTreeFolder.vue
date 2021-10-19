<template>
  <div class="directory-content">
    <QCollapse :open="isRoot">
      <template #trigger="{ show }">
        <div
          class="d-flex mb-1 align-items-center"
          @click="selectDirectory(folder)"
          dropzone="files"
          @dragover.prevent
          @drop.prevent="moveFiles(folder)"
        >
          <QBtn class="p-0">
            <QIcon
              :icon="
                show ? 'mdi-chevron-right mdi-rotate-90' : 'mdi-chevron-right'
              "
            />
          </QBtn>
          <div
            class="d-flex align-items-center selectable"
            @click="selectDirectory(folder, show)"
          >
            <QIcon :icon="show ? 'mdi-folder-open' : 'mdi-folder'" />
            <span class="ml-2">{{ isRoot ? "My Drive" : folder.name }}</span>
          </div>
        </div>
      </template>
      <div class="directory-content border-left pl-2 ml-3">
        <div class="directories">
          <div
            class="nested"
            v-for="directory in folder.folders"
            :key="directory.path"
          >
            <DriveTreeFolder
              @selectDirectory="selectDirectory"
              @selectFile="selectFile"
              :folder="directory"
              :selected-directory="selectedDirectory"
              :selected-file="selectedFile"
            />
          </div>
        </div>
        <div class="files" v-if="selectedDirectory.path === folder.path">
          <div
            v-for="file in folder.files"
            :key="file.name"
            class="
              selectable
              no-select
              clip-text
              mb-1
              p-1
              rounded
              d-flex
              align-items-center
            "
            :class="{ selected: selectedFiles[file.path] }"
            style="max-width: 300px"
            @click="
              selectFile(file);
              hilightFile(file);
            "
            :draggable="selectedFiles[file.path] ? true : false"
            @dragstart="onDragStart"
            @dragover.prevent
          >
            <QIcon :icon="file.icon" />
            <span class="ml-2 clip-text">{{ file.name }}</span>
          </div>
        </div>
      </div>
    </QCollapse>
    <div
      ref="ghostImg"
      class="ghost-img p-3 bg-dark text-white rounded elevation-4"
    >
      <QIcon icon="mdi-file-document" />
      <span class="ml-3 clip-text">Moving {{ selected.length }} Files</span>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed } from '@vue/reactivity'
import { DriveService, selectedFiles } from './DriveService'

export default {
  props: {
    folder: { type: Object, required: true },
    selectedDirectory: { type: Object, default() { return {} } },
    selectedFile: { type: Object, default() { return {} } },
    root: { type: String, default: '' }
  },
  emits: ['selectDirectory', 'selectFile'],
  setup(props, { emit }) {
    const ghostImg = ref(null)
    const selected = computed(() => Object.values(selectedFiles.value))
    return reactive({
      ghostImg,
      selectedFiles,
      selected,
      isRoot: computed(() => props.folder.name === props.root),
      selectFile(file) {
        emit('selectFile', file)
      },
      selectDirectory(directory, checkExpand) {
        if (checkExpand) {
          event.preventDefault()
          event.stopImmediatePropagation()
          event.stopPropagation()
        }
        emit('selectDirectory', directory)
      },
      hilightFile(file) {
        if (selectedFiles.value[file.path]) {
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
      moveFiles(folder) {
        DriveService.moveFiles(folder.path)
      },
      onDragStart() {
        event.dataTransfer.setDragImage(ghostImg.value, 0, 0)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.selected {
  background: var(--dark);
  color: var(--white);
}

.ghost-img {
  transition: all 0.15s linear;
  position: fixed;
  pointer-events: none;
  transform: translateX(-900px);
  width: 250px;
  height: 60px;
  z-index: 2;
}
</style>
