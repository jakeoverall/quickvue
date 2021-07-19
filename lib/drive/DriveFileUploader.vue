<template>
  <div class="drop-screen show scrollable-y" @drop.prevent="handleDrop" @dragover.prevent>
    <div class="fade show col-lg-10 m-auto col-12">
      <div class="border p-4 card p-2">
        <div
          class="d-flex align-items-center justify-content-between mb-3 upload-title"
        >
          <b class="f-16">Upload Files</b>
          <QBtn class="icon" @click="closeUploader">
            <QIcon icon="mdi-close" />
          </QBtn>
        </div>
        <div class="text-center p-5 border rounded bg-light" v-if="!files.length">
          <p class="f-18">
            Drop files here to add them to your drive
          </p>
          <label for="files" class="btn selectable d-flex align-items-center justify-content-center">
            <b class="text-primary f-14">or Select Files</b>
            <input
              type="file"
              id="files"
              @change="handleSelect"
              multiple
              class="sr-only"
            >
          </label>
        </div>
        <label for="files" class="selectable d-flex align-items-center text-info" v-else>
          <QIcon icon="mdi-file-plus" />
          <b class="ml-3 f-12">Select Files</b>
          <input type="file" id="files" @change="handleSelect" multiple class="sr-only">
        </label>
        <div v-if="files.length" class="files-preview">
          <div
            class="file-previews-container bg-light border p-2 rounded d-flex align-items-center show-scroll scrollable-y"
          >
            <div
              class="file-preview position-relative border rounded elevation-1"
              v-for="(f, i) in files"
              :key="i"
            >
              <audio
                v-if="f.file.type.includes('audio')"
                :src="f.preview"
                :alt="f.file.name"
                class="media-preview"
                controls
              />
              <video
                v-else-if="f.file.type.includes('video')"
                :src="f.preview"
                :alt="f.file.name"
                class="media-preview"
              />
              <img
                v-else-if="f.file.type.includes('image')"
                :src="f.preview"
                :alt="f.file.name"
                class="media-preview"
              />
              <div class="media-preview no-preview d-flex align-items-center justify-content-center" v-else>
                <QIcon
                  class="mx-3 text-white"
                  style="font-size: 4rem"
                  :icon="getFileIcon(f.file.type)"
                />
              </div>
              <div class="bg-white py-3 px-2 d-flex align-items-center">
                <QIcon
                  class="mx-3 text-info"
                  :icon="getFileIcon(f.file.type)"
                />
                <div class="d-flex flex-column w-100">
                  <span class="clip-text w-75">{{ f.file.name }}</span>
                  <small class="text-muted">{{ getMbs(f.file.size) === 0 ? getKbs(f.file.size)+' kbs' : getMbs(f.file.size)+ ' Mb' }}</small>
                </div>
              </div>
              <div
                class="remove-file-icon action muted d-flex align-items-center justify-content-center on-hover"
                title="Remove File"
              >
                <QBtn class="btn-block text-white h-100" @click="removeFile(f)">
                  <b>Remove File</b>
                  <QIcon
                    icon="mdi-close mx-3"
                  />
                </QBtn>
              </div>
            </div>
          </div>
          <div class="uploader-footer">
            <div class="my-2">
              <sup> {{ files.length }} Files : {{ totalMbs }} Mbs </sup>
            </div>
            <div class="mb-2">
              <QBtn
                class="btn-info"
                :disabled="uploadDisabled"
                @click="upload"
              >
                <b>
                  Upload
                </b>
              </QBtn>
              <QBtn @click="createDirectory" :disabled="uploadDisabled" class="mx-1">
                <QIcon icon="mdi-folder-plus mr-1" />
                <b>New Folder</b>
              </QBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UTILS } from '../utils'
import { Logger } from '../monitoring/Logger'
import { DriveService } from './DriveService'

export default {
  props: {
    folder: { type: Object, required: true }
  },
  emits: ['close'],
  data() {
    return {
      show: false,
      showUploader: 0,
      previewsReady: false,
      uploading: false,
      files: []
    }
  },
  computed: {
    uploadDisabled() {
      return this.files.length === 0
    },
    totalKbs() {
      return this.files.reduce((acc, f) => (acc += f.file.size), 0)
    },
    totalMbs() {
      return Number((this.totalKbs / 1048576).toFixed(1))
    }
  },
  methods: {
    showDropScreen() {
      if (this.show) {
        return
      }
      if (!event.dataTransfer.files.length) {
        return
      }
      this.show = true
    },
    closeUploader() {
      this.files = []
      this.showUploader--
      this.show = false
      this.$emit('close')
    },
    async processFiles(files) {
      if (!files) return
      try {
        this.previewsReady = false
        this.files = await DriveService.processFiles([...files])
        this.previewsReady = true
      } catch (e) {
        Logger.error('[PROCESS_ERROR]', e)
      }
    },
    async handleSelect(e) {
      try {
        this.processFiles(e.target.files)
      } catch (e) {
        Logger.error(e)
      }
    },
    async handleDrop(e) {
      try {
        this.processFiles(e.dataTransfer.files)
      } catch (e) {
        Logger.error(e)
      }
    },
    removeFile(file) {
      this.files = this.files.filter(f => {
        return f !== file
      })
    },
    async upload() {
      try {
        this.uploading = true
        await DriveService.addFiles(this.folder, this.files)
        this.closeUploader()
      } catch (e) {
        Logger.error('uploader error', e)
      } finally {
        this.uploading = false
      }
    },
    getFileIcon(type = '') {
      if (type.includes('audio')) {
        return 'mdi-file-audio'
      }
      if (type.includes('video')) {
        return 'mdi-file-video'
      }
      if (type.includes('image')) {
        return 'mdi-file-image'
      }
      switch (type) {
        case 'text/css':
        case 'text/html':
        case 'text/javascript':
        case 'application/json':
          return 'mdi-file-code'
        case 'application/pdf':
          return 'mdi-file-pdf'
        case 'application/postscript':
          return 'mdi-file'
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'mdi-file-excel'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'mdi-file-powerpoint'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'mdi-file-word'
        default:
          return 'mdi-file-document'
      }
    },
    getMbs(val) {
      return Number((val / 1048576).toFixed(1))
    },
    getKbs(val) {
      return Number((val / 1024).toFixed(1))
    },
    async createDirectory() {
      try {
        let n = await UTILS.$prompt('Please specify a name for the new folder')
        if (!n) { return }
        n = n.toLowerCase().split(' ').join('')
        this.uploading = true
        await DriveService.addFiles({
          path: this.folder.path + n
        }, this.files)
        this.closeUploader()
      } catch (e) {
        Logger.error('uploader error', e)
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-previews-container {
  max-height: 70vh;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.file-preview {
  margin: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 280px;
  overflow: hidden;
}
.media-preview {
  height: 280px;
  width: 280px;
  object-fit: contain;
  background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
.media-preview.no-preview{
  background: rgb(36, 36, 56);
}
.remove-file-icon {
  position: absolute;
  height: 20%;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(100, 100, 100, 0.7);
}
.drop-screen {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  user-select: none;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.drop-screen.show {
  background: rgba(49, 49, 49, 0.301);
  pointer-events: all;
  z-index: 3;
  pointer-events: all;
}
.drop-uploader-logo {
  background: var(--dark);
  color: white;
  padding: 1rem;
  border-radius: 50%;
}
@media screen and (max-width: 768px) {
  .drop-screen {
    left: 0;
    padding: 1rem 0;
    max-height: 100vh;
    overflow-y: auto;
  }
  .drop-screen .upload-title{
    margin-top: 1rem;
  }
  .drop-screen .file-previews-container {
    max-height: 250px;
  }
  .drop-screen .file-preview {
    width: 100%;
  }
}
</style>
