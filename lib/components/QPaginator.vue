<template>
  <div class="paginator">
    <div class="pages d-flex align-items-center">
      <div class="flex-grow-1">
        <small class="text-muted">
          <slot name="stats" :results="results" :pager="pager" :page="page"></slot>
        </small>
      </div>
      <div class="pages">
        <div class="page first-page" v-if="showJumps && pager[0] !== 1">
          <QBtn class="rounded p-1 selectable selectable-dark" @click="jumpTo(1)">
            <QIcon icon="mdi-chevron-double-left" />
          </QBtn>
        </div>
        <div class="page" v-for="(p,i) in pager" :key="p+'__'+i">
          <slot name="pages" :num="p" :index="i" :results="results">
            <QBtn class="rounded mx-1" :class="page == p ? 'btn-primary': ' btn-outline-dark selectable selectable-dark'">
              {{ p }}
            </QBtn>
          </slot>
        </div>
        <div class="page last-page" v-if="showJumps && pager[pager.length-1] !== pages">
          <QBtn class="rounded p-1  selectable selectable-dark" @click="jumpTo(pages)">
            <QIcon icon="mdi-chevron-double-right" />
          </QBtn>
        </div>
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
    items: { type: Array, required: true },
    chips: { type: Number, default: 6, min: 4, max: 20 },
    showJumps: { type: Boolean, default: false }
  },
  emits: ['jumpTo'],
  setup(props, { emit }) {
    const pages = computed(() => props.items.length % props.limit === 0 ? props.items.length / props.limit : ~~(props.items.length / props.limit) + 1)
    return reactive({
      pages,
      jumpTo(n) {
        emit('jumpTo', n)
      },
      pager: computed(() => {
        const p = Number(props.page)
        const nums = [p]
        let max = props.chips
        if (props.chips > pages.value) {
          max = pages.value
        }
        if (props.showJumps && pages.value > max + 2) { max -= 2 }
        let i = 1
        while (nums.length < max) {
          let x = 0
          if (p + i <= pages.value) {
            nums.push(p + i)
            x++
          }
          if (p - i > 0 && nums.length < max) {
            nums.unshift(p - i)
            x++
          }
          i++
          if (i > max) { break }
          if (x === 0) { break }
        }
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
