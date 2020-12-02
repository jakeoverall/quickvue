<template>
  <div class="v-list w-100 scrollable-y show-scroll" role="list">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.v-list {
  display: block;
  padding: 8px 0;
  position: static;
  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
  will-change: box-shadow;
  box-shadow: 0 0 0 0 rgba(0,0,0,.2), 0 0 0 0 rgba(0,0,0,.14), 0 0 0 0 rgba(0,0,0,.12);
  &.nav{
    padding: initial 8px;
  }
}
</style>
