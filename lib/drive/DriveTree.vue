<template>
  <div class="card h-100 tree-container position-relative"
       @contextmenu.prevent
       @dragover.prevent="onDragOver"
       @drop.prevent="checkFiles"
  >
    <div class="border-bottom sticky-top bg-white">
      <div class="p-3 mx-4">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="f-14 m-0">
              <QIcon icon="mdi-folder-sync mr-2 text-orange darken-10 f-20" />
              <b>My Drive</b>
            </p>
            <small class="text-muted">
              Manage your account files
            </small>
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar p-2 bg-dark d-flex align-items-center justify-content-between">
      <div class="w-50">
        <QInput v-model="query" placeholder="Find Files" />
      </div>
      <div>
        <QBtn @click="showUploader = true" class="mx-1 text-white">
          <QIcon icon="mdi-cloud-upload mr-1" />
          <b>Upload</b>
        </QBtn>
      </div>
    </div>
    <div class="h-100 bg-light h-100 scrollable-y show-scroll">
      <div class="w-100">
        <div class="directory-tree">
          <div class="scrollable-area scrollable-y show-scroll position-relative">
            <div class="tree p-3" v-if="top">
              <DriveTreeFolder @selectDirectory="setDirectory"
                               @selectFile="setFile"
                               :folder="top"
                               :selected-directory="selectedDirectory"
                               :selected-file="selectedFile"
                               :root="root"
                               v-if="query.length < 1"
              />
              <div class="files" v-else>
                <div v-for="file in found"
                     :key="file.name"
                     class="selectable no-select clip-text mb-1 p-1 rounded d-flex align-items-center"
                     :class="{'selected': selectedFiles[file.path] }"
                     style="max-width: 300px"
                     @click="setFile(file);hilightFile(file)"
                >
                  <QIcon :icon="file.icon" />
                  <span class="ml-2 clip-text">{{ file.name }}</span>
                </div>
              </div>
            </div>
            <div class="preview-pane bg-dark-grey darken-10" :class="{'show': selectedFile || selectedDirectory.name }">
              <div v-if="selectedFile">
                <div class="content-view-cards w-100 d-flex align-items-center justify-content-center bg-grey ">
                  <DriveFilePreview :file="selectedFile" />
                </div>
                <div class="card m-2 elevation-1 text-dark">
                  <DriveFile class="mb-0" :file="selectedFile" />
                  <QList class="">
                    <QListItem class="d-flex flex-wrap align-items-center justify-content-between">
                      <div>
                        <QBtn @click="downloadFile" class="mx-1">
                          <QIcon icon="mdi-download" class="mr-2" /> download
                        </QBtn>
                        <QBtn @click="copyLink" class="mx-1">
                          <QIcon icon="mdi-link" class="mr-2" /> URL
                        </QBtn>
                      </div>
                      <div>
                        <QBtn @click="deleteFile" class="mx-1">
                          <QIcon icon="mdi-delete" class="mr-2" /> remove
                        </QBtn>
                      </div>
                    </QListItem>
                  </QList>
                </div>
              </div>
              <div v-else-if="selectedDirectory.name">
                <div class="content-view-cards w-100 d-flex align-items-center justify-content-center bg-grey ">
                  <DriveFilePreview :file="selectedDirectory" />
                </div>
                <div class="card m-2 elevation-1 text-dark">
                  <QList class="p-0">
                    <QListItem class="d-flex flex-wrap align-items-center justify-content-between">
                      <div>
                        <QBtn @click="downloadDirectory" class="mx-1">
                          <QIcon icon="mdi-download" class="mr-2" /> download
                        </QBtn>
                      </div>
                      <div>
                        <QBtn class="mx-1 p-1" title="files">
                          <QIcon icon="mdi-folder-multiple" class="mr-2" /> {{ selectedDirectory.folders.length }}
                        </QBtn>
                        <QBtn class="mx-1 p-1" title="files">
                          <QIcon icon="mdi-file-document-multiple" class="mr-2" /> {{ selectedDirectory.files.length }}
                        </QBtn>
                        <QBtn class="mx-1 p-1" title="files" v-if="selectedDirectory.path">
                          {{ directorySizeMb }} Mb
                        </QBtn>
                      </div>
                    </QListItem>
                  </QList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="position-absolute" style="bottom: 0; left:0; right: 0;">
      <slot name="footer" :selected="selected" />
    </div>
    <DriveFileUploader v-if="showUploader" @close="showUploader = false" :folder="selectedDirectory" />
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { drive, DriveService, getEmailRoot, selectedFiles } from './DriveService'
import { computed, onMounted } from '@vue/runtime-core'
import { UTILS } from '../utils'

export default {
  props: {
    user: { type: Object, required: true },
    api: { type: Object, required: true }
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const root = ref(getEmailRoot(props.user.email))
    const top = computed(() => drive.structure[root.value])
    const selectedDirectory = ref({ ...top.value })
    const directorySizeMb = ref('')
    const activeKey = ref('')
    const selectedFile = computed(() => selectedFiles.value[activeKey.value])
    const query = ref('')
    const showUploader = ref(false)

    onMounted(() => {
      DriveService.api = props.api
      DriveService.getFiles()
    })

    const found = computed(() => {
      const q = query.value.toLowerCase()
      return drive.contents.filter(f => f.name.toLowerCase().includes(q))
    })

    const selected = computed(() => Object.values(selectedFiles.value))

    return reactive({
      top,
      root,
      drive,
      selectedFile,
      selectedDirectory,
      query,
      found,
      directorySizeMb,
      showUploader,
      selectedFiles,
      selected,
      activeKey,
      setFile(file) {
        activeKey.value = file.path
      },
      setDirectory(directory) {
        activeKey.value = ''
        selectedFiles.value = {}
        selectedDirectory.value = directory
        directorySizeMb.value = selectedDirectory.value.files.reduce((acc, f) => acc + f.sizeMb, 0).toFixed(1)
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
      copyLink() {
        UTILS.$copyToClipboard(selectedFile.value.url)
      },
      downloadFile() {
        DriveService.saveFile(selectedFile.value)
      },
      async deleteFile() {
        await DriveService.removeFiles([selectedFile.value])
        delete selectedFiles.value[selectedFile.value.path]
      },
      async downloadDirectory() {
        await DriveService.generateZip(selectedDirectory.files, selectedDirectory.name)
      },
      onDragOver() {
        if (showUploader.value) return
        if (event.dataTransfer.types.includes('Files')) {
          showUploader.value = true
        }
      },
      toggleUploader() {
        if (showUploader.value) {
          return
        }
        showUploader.value = true
      },
      checkFiles() {
        if (event.dataTransfer.files.length === 0) {
          showUploader.value = false
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>

.tree-container{
  overflow: hidden;
  .preview-pane{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    transform: translateX(100%);
    transition: all .3s linear;

    &.show{
      transform: translateX(0);
      width: 50%;
    }
  }
  .selected{
    background: var(--dark);
    color: var(--white);
  }
}

</style>
