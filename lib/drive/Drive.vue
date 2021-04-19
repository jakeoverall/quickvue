<template>
  <div class="card no-context codeworks-drive position-relative"
       @contextmenu.prevent
       @dragover.prevent="onDragOver"
       @drop.prevent="checkFiles"
  >
    <div class="drive-toolbar d-flex align-items-center justify-content-between border-bottom">
      <div class="d-flex w-50 ml-2">
        <QBtn @click="showUploader = true" class="mx-1">
          <QIcon icon="mdi-cloud-upload mr-1" />
          <b>Upload</b>
        </QBtn>
      </div>
      <div class="d-flex align-items-center">
        <QBtn @click="toggleContentView">
          <QIcon :icon="contentView.icon" />
        </QBtn>
      </div>
    </div>
    <DriveNavCrumbs class="scrollable-x" :drive="drive" :path="folderKey" :root="root" />
    <div class="drive-contents bg-light position-relative" :class="contentView.view">
      <DriveFolder :folder="activeFolder" :drive="drive" v-if="activeFolder" @setFolder="setFolder" />
    </div>
    <DriveFileUploader v-if="showUploader" @close="showUploader = false" :folder="activeFolder" />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { DriveService, drive, getEmailRoot } from './DriveService'
import { useRoute } from 'vue-router'

export default {
  props: {
    user: { type: Object, required: true },
    api: { type: [Object, Function], required: true }
  },
  setup(props, { emit }) {
    const route = useRoute()
    const root = ref(getEmailRoot(props.user.email))
    const folderKey = ref(getEmailRoot(props.user.email))
    const showUploader = ref(false)

    watchEffect(() => {
      folderKey.value = route.params.key || getEmailRoot(props.user.email)
    })

    const currentView = ref(1)
    const query = ref('')
    const contentViews = [
      { view: 'content-view-cards', icon: 'mdi-view-grid' },
      { view: 'content-view-list', icon: 'mdi-format-list-bulleted-type' }
    ]
    const contentView = computed(() => contentViews[currentView.value])
    const activeFolder = computed(() => drive.structure[folderKey.value])
    const crumbs = computed(() => folderKey.value.split('/')
      .filter(k => {
        const i = folderKey.value.indexOf(k)
        if (i === -1 || i === 0) { return false }
        const key = folderKey.value.slice(0, i + k.length + 1)
        return drive.structure[key]
      })
      .map(k => {
        const i = folderKey.value.indexOf(k)
        const key = folderKey.value.slice(0, i + k.length + 1)
        return drive.structure[key]
      })
    )

    onMounted(() => {
      DriveService.api = props.api
      DriveService.getFiles()
    })

    return reactive({
      drive,
      contentView,
      query,
      folderKey,
      activeFolder,
      root,
      crumbs,
      showUploader,
      toggleContentView() {
        currentView.value++
        if (currentView.value >= contentViews.length) {
          currentView.value = 0
        }
      },
      setFolder(folder) {
        folderKey.value = folder.path
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

<style scoped lang="scss">

</style>
