<template>
  <i class="mdi" aria-hidden="true" :class="icon" />
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true }
  }
}
</script>

<style scoped lang="scss">

i{
  align-items: center;
  display: inline-flex;
  font-feature-settings: "liga";
  font-size: 24px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  text-indent: 0;
  transition: .3s cubic-bezier(.25,.8,.5,1),visibility 0s;
  vertical-align: middle;
  user-select: none;
}

</style>
