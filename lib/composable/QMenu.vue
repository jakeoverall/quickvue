<template>
  <div ref="popperTree">
    <span ref="trigger" @click.stop.capture="onTrigger">
      <slot name="trigger" />
    </span>

    <Teleport to="#menu-popper">
      <div ref="menu" class="popper-container" :style="{'margin-top': offsetY, 'margin-left': offsetX }" @click.stop="onMenuClick">
        <div class="menu-content scrollable-y" :class="{show}">
          <slot />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  props: {
    closeOnClick: { type: Boolean, default: false },
    offsetY: { type: String, default: '' },
    offsetX: { type: String, default: '' },
    persistent: { type: Boolean, default: false }
  },
  data() {
    return {
      show: false,
      popper: null,
      root: null
    }
  },
  beforeMount() {
    let root = document.querySelector('#menu-popper')
    if (!root) {
      root = document.createElement('div')
      root.id = 'menu-popper'
      document.body.appendChild(root)
    }
    this.root = root
    window.addEventListener('keydown', this.checkEsc)
  },
  mounted() {
    this.popper = createPopper(this.$refs.trigger, this.$refs.menu, {
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, 0]
        }
      }, {
        name: 'flip',
        enabled: true
      }, {
        name: 'sameWidth',
        enabled: true,
        fn: ({ state }) => {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`
        },
        phase: 'beforeWrite',
        requires: ['computeStyles']
      }]
    })
    document.addEventListener('click', this.outsideClick)
  },
  beforeUnmount() {
    if (this.popper) {
      this.popper.destroy()
      this.popper = null
    }
    // document.removeEventListener('click', this.outsideClick)
    window.removeEventListener('keydown', this.checkEsc)
  },
  methods: {
    onTrigger() {
      this.show = !this.show
      this.popper.update()
    },
    checkEsc(e) {
      if (this.show && e.which === 27 && !this.persistent) {
        this.show = false
      }
    },
    onMenuClick() {
      if (this.closeOnClick) {
        this.show = false
      }
    },
    outsideClick() {
      if (!this.show) { return }
      if (event.target === this.root) { return }
      this.show = false
    }
  }
}
</script>

<style scoped lang="scss">
.popper-container{
  pointer-events: none;
  position: relative;
  z-index: 9;
}
.menu-content{
  display: none;
  max-width: 90%;
  max-height: 45vh;
  background: var(--light);
  opacity: 0;
  margin: 0 1rem;
  pointer-events: none;
  will-change: opacity;
  transition: opacity .15s linear;
  border-radius: 4px;
  box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
  &.show{
    display: flex;
    opacity: 1;
    pointer-events: all;
  }
}

</style>
