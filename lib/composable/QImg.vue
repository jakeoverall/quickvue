<template>
  <img :class="{rounded}" :style="{height:size|| height, width:size|| width}" />
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    rounded: { type: Boolean, default: false },
    size: { type: String, default: '' },
    height: { type: String, default: '55px' },
    width: { type: String, default: '55px' }
  }
}
</script>

<style scoped lang="scss">

img{
  object-fit: contain;
  object-position: center;
}

</style>
