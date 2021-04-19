<template>
  <div class="w-100 file-preview position-relative"
       :class="{'no-preview':!hasPreview}"
       @mouseenter="showControls = true"
       @mouseleave="showControls = false"
       v-if="file.type"
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
    <b class="filepath position-absolute text-white" style="bottom: 1rem;" v-if="!hasPreview">
      {{ file.path.indexOf('/') == -1 ? 'My Drive/' : file.path.slice(file.path.indexOf('/')) }}
    </b>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
export default {
  props: {
    file: { type: Object, required: true }
  },
  setup(props) {
    const showControls = ref(false)
    return reactive({
      showControls,
      hasPreview: computed(() => {
        const type = props.file.type || ''
        return type.includes('audio') || type.includes('video') || type.includes('image')
      })
    })
  }
}
</script>

<style lang="scss" scoped>

.file-preview{
  img, video{
    height: 50vh;
    object-fit: contain;
    padding: 1rem;
  }

  &.no-preview{
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(36, 36, 56);
  }
}

</style>
