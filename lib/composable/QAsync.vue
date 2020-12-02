<template>
  <div style="display:contents">
    <slot name="loading" v-if="!ready && !error" />
    <slot v-else-if="results" v-bind="{results}" />
    <slot name="error" v-bind="{error}" v-else-if="error" />
  </div>
</template>

<script>
export default {
  props: {
    promise: { type: [Promise, Function], required: true }
  },
  data() {
    return {
      error: null,
      ready: false,
      results: null
    }
  },
  watch: {
    promise: {
      async handler() {
        try {
          this.results = null
          this.error = null
          this.ready = false
          this.results = await this.promise()
          this.ready = true
        } catch (e) {
          this.error = e.message
        }
      },
      immediate: true
    }
  }
}

</script>

<style>

</style>
