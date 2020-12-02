<template>
  <router-link tag="button" class="btn" v-if="to" :style="{top,left,bottom,right}" :to="to">
    <span class="btn-content text-uppercase">
      <slot />
    </span>
  </router-link>

  <button class="btn" :class="{raised, icon}" :style="{top,left,bottom,right}" v-else>
    <span class="btn-content text-uppercase">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    raised: Boolean,
    icon: Boolean,
    to: { type: Object, default: () => null },
    top: { type: String, default: '' },
    left: { type: String, default: '' },
    right: { type: String, default: '' },
    bottom: { type: String, default: '' }
  }
}
</script>

<style scoped lang="scss">
a,button {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: .0892857143em;
  justify-content: center;
  outline: 0;
  position: relative;
  text-decoration: none;
  text-indent: .0892857143em;
  text-transform: uppercase;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  font-size: .875rem;
  transition: all .35s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.raised:not(:active),&.raised:not(:focus){
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  }
  &.icon{
    height: 36px;
    width: 36px;
    border-radius: 50%;
    min-height: 0;
    min-width: 0;
    padding: 0;
  }
  &.fab{
    height: 36px;
    width: 36px;
    padding: 1.5rem;
    border-radius: 50%;
    position: fixed;
    z-index: 2;
  }
  &:before {
    border-radius: inherit;
    bottom: 0;
    color: inherit;
    content: "";
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity .2s cubic-bezier(.4,0,.6,1);
    background-color: currentColor;
  }
  &:hover::before{
    opacity: .1;
  }
  .btn-content{
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1 0 auto;
    justify-content: inherit;
    line-height: normal;
    position: relative;
  }

}
</style>
