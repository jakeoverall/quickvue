<template>
  <div class="v-list-item" role="listitem">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.v-list-item {
  align-items: center;
  display: flex-root;
  flex: 1 1 100%;
  flex-grow: 1;
  letter-spacing: normal;
  min-height: 2rem;
  outline: none;
  position: relative;
  text-decoration: none;
  border-radius: 4px;
  padding: 8px;
  }
</style>
