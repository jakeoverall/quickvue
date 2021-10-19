<template>
  <div class="file m-2 border rounded no-select">
    <div v-if="file.type"
         class="media-preview w-100"
         :class="{'no-preview':!hasPreview}"
         @mouseenter="showControls = true"
         @mouseleave="showControls = false"
    >
      <audio
        v-if="file.type.includes('audio')"
        :src="file.url"
        :alt="file.name"
        class="w-100"
        :controls="showControls"
      />
      <video
        v-else-if="file.type.includes('video')"
        :src="file.url+'#t=0.5'"
        :alt="file.name"
        class="w-100 img-cover bg-dark rounded-top"
        preload="metadata"
        @click.prevent
        :controls="showControls"
      />
      <img
        v-else-if="file.type.includes('image')"
        :src="file.url"
        :alt="file.name"
        class="img-cover w-100 rounded-top"
        draggable="false"
      />
      <QIcon
        v-else
        class="mx-3 text-white"
        style="font-size: 4rem"
        :icon="file.icon"
      />
    </div>
    <div class="bg-white rounded-bottom w-100 text-left p-3">
      <div class="filename d-flex align-items-center">
        <QIcon :icon="file.icon || 'mdi-file-document'" />
        <span class="ml-3 clip-text w-50">{{ file.name }}</span>
        <div class="file-details flex-grow-1">
          <div class="mx-3 d-flex flex-wrap justify-content-end">
            <div class="d-flex align-items-center justify-content-between mr-5">
              <span>{{ file.sizeMb !== 0 ? file.sizeMb + ' Mb' : ~~(file.length / 1000) + ' kbs' }}  </span>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <span>{{ dateFilter(file.createdAt) }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from '@vue/runtime-core'
import { dateFilter } from '../DateFilters'

export default {
  props: {
    file: { type: Object, required: true }
  },
  emits: ['select-file'],
  setup(props, { emit }) {
    const showControls = ref(false)
    return reactive({
      dateFilter,
      showControls,
      selectFile() {
        emit('select-file', props.file)
      },
      hasPreview: computed(() => {
        const type = props.file.type || ''
        return type.includes('audio') || type.includes('video') || type.includes('image')
      })
    })
  }
}
</script>

<style lang="scss" scoped>

.content-view-cards .file{
  display: inline-block;
  flex-direction: column;
  justify-content: center;
  max-width: 280px;
  img, video {
    height: 280px;
    width: 280px;
  }
  .file-details{
    display: none;
  }
  .media-preview {
    height: 280px !important;
    width: 280px !important;
    object-fit: contain;
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.no-preview{
      background: rgb(36, 36, 56);
    }
  }
}
.file{
  align-items: center;
  img {
    height: 60px;
    width: 60px;
  }
}

.media-preview {
  display: none;
}

.img-cover{
  object-fit: cover;
  object-position: center;
}
.img-contain{
  object-fit: contain;
  object-position: center;
}

</style>
