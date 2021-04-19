<template>
  <div class="card h-100 tree-container"
       @contextmenu.prevent
       @dragover.prevent="onDragOver"
       @drop.prevent="checkFiles"
  >
    <div class="border-bottom sticky-top bg-white">
      <div class="p-3 mx-4">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="f-14 m-0">
              <QIcon :icon="file.icon" class="mr-2 f-20" />
              <b>{{ file.name }}</b>
            </p>
            <small class="text-muted">
              {{ file.path.slice(file.path.indexOf('/')) }}
            </small>
          </div>
        </div>
      </div>
    </div>
    <div class="h-100 bg-white rounded-bottom">
      <div class="w-100">
        <div v-if="file.type != 'directory'">
          <div class="content-view-cards w-100 d-flex align-items-center justify-content-center bg-grey position-relative">
            <DriveFilePreview :file="file" />
            <div class="on-hover">
              <QBtn class="position-absolute text-dark-grey" left="0" bottom="0" top="0" @click="goNext(-1)">
                <QIcon icon="mdi-chevron-left f-28" />
              </QBtn>
              <QBtn class="position-absolute text-dark-grey" right="0" bottom="0" top="0" @click="goNext(1)">
                <QIcon icon="mdi-chevron-right f-28" />
              </QBtn>
            </div>
          </div>
          <div class="">
            <QList>
              <QListItem class="d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <QBtn @click="downloadFile" class="mx-1">
                    <QIcon icon="mdi-download" class="mr-2" /> download
                  </QBtn>
                  <QBtn @click="copyLink" class="mx-1">
                    <QIcon icon="mdi-link" class="mr-2" /> URL
                  </QBtn>
                  <a :href="file.url" target="_blank">
                    <QBtn class="mx-1">
                      <QIcon icon="mdi-open-in-new" class="mr-2" /> Open
                    </QBtn>
                  </a>
                </div>
                <div>
                  <QBtn @click="deleteFile" class="mx-1">
                    <QIcon icon="mdi-delete" class="mr-2" /> remove
                  </QBtn>
                </div>
              </QListItem>
            </QList>
            <DriveFile class="mb-0" :file="file" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { drive, DriveService, selectedFiles } from './DriveService'
import { UTILS } from '../utils'

export default {
  props: {
    file: { type: Object, default() { return {} } }
  },
  setup(props) {
    return reactive({
      copyLink() {
        UTILS.$copyToClipboard(props.file.url)
      },
      downloadFile() {
        DriveService.saveFile(props.file)
      },
      async deleteFile() {
        await DriveService.removeFiles([props.file])
      },
      goNext(n) {
        const i = drive.contents.findIndex(f => f.url === props.file.url)
        let nextI = i + n
        if (nextI > drive.contents.length - 1) {
          nextI = 0
        }
        if (nextI < 0) {
          nextI = drive.contents.length - 1
        }
        const next = drive.contents[nextI]
        selectedFiles.value = {}
        selectedFiles.value[next.path] = next
      }
    })
  }
}
</script>

<style>

</style>
