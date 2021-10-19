<template>
  <div class="toaster" :class="location">
    <transition-group name="notification-list" tag="div">
      <QToast
        v-for="n in notifications"
        :key="n.id"
        :title="n.title"
        :body="n.body || n.message"
        :type="n.type"
        :life="n.life || 3"
        :icon="n.icon"
        :img="n.img"
        @close="remove(n)"
      />
    </transition-group>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { notifications } from '../NotificationService'
export default {
  props: {
    location: {
      type: String,
      validator(val) {
        return (
          [
            'top-left',
            'top-right',
            'top-center',
            'bottom-left',
            'bottom-right',
            'bottom-center'
          ].indexOf(val) !== -1
        )
      },
      default: 'top-right'
    }
  },
  setup() {
    return {
      notifications: computed(() => notifications),
      remove(toast) {
        const i = notifications.findIndex(n => n.id === toast.id)
        if (i === -1) {
          return
        }
        notifications.splice(i, 1)
      }
    }
  }
}
</script>

<style scoped>
.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
}

.toaster {
  position: fixed;
  display: inline;
  z-index: 999;
}

.top-left {
  top: 1em;
  left: 1em;
}

.top-right {
  top: 1em;
  right: 1em;
}

.top-center {
  top: 1em;
  left: 50vw;
  transform: translateX(-50%);
}

.bottom-left {
  bottom: 1em;
  left: 1em;
}

.bottom-right {
  bottom: 1em;
  right: 1em;
}

.bottom-center {
  bottom: 1em;
  left: 50vw;
  transform: translateX(-50%);
}
</style>
