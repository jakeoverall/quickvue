<template>
  <div class="paginator ">
    <div class="pages d-flex align-items-center">
      <div class="flex-grow-1">
        <small class="text-muted">
          <slot name="stats" :results="results" :pager="pager" :page="page"></slot>
        </small>
      </div>
      <div class="page" v-for="(p,i) in pager" :key="p+'__'+i">
        <slot name="pages" :num="p" :index="i" :results="results">
          <QBtn class="rounded mx-1" :class="page == p ? 'btn-primary': ' btn-outline-dark selectable selectable-dark'">
            {{ p }}
          </QBtn>
        </slot>
      </div>
    </div>
    <div class="results">
      <div class="result" v-for="(item,i) in results" :key="item.id || page+'__'+i">
        <slot name="results" :item="item" :index="i" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from 'vue'
export default {
  props: {
    limit: { type: Number, default: 10 },
    page: { type: [Number, String], required: true },
    items: { type: Array, required: true }
  },
  setup(props, { emit }) {
    const pages = computed(() => props.items.length % props.limit === 0 ? props.items.length / props.limit : ~~(props.items.length / props.limit) + 1)
    return reactive({
      pager: computed(() => {
        const nums = [props.page]
        let i = 1
        while (i <= 2) {
          if (props.page + i <= pages.value) {
            nums.push(props.page + i)
          }
          if (props.page - i > 0) {
            nums.unshift(props.page - i)
          }
          i++
        }
        if (nums[0] !== 1) { nums.unshift(1) }
        if (nums[nums.length - 1] !== pages.value) { nums.push(pages.value) }
        return nums
      }),
      results: computed(() => props.items.slice((props.page - 1) * props.limit, props.page * props.limit))
    })
  }
}
</script>

<style lang="scss" scoped>
.page{
  display: contents;
}
</style>
