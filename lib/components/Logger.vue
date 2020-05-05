<template>
  <div>
    <transition name="slide-y-reverse-transition">
      <div :permanent="$log.visible" v-if="$log.visible" class="logger-container elevation-4">
        <div class="logger-view">
          <div class="dark text-white d-flex justify-content-between">
            <div>
              <v-btn small dark text @click="$log.clear">
                <v-icon small>mdi-cancel</v-icon>
                <small class="ml-2">clear log</small>
              </v-btn>
              <slot name="toolbar"></slot>
            </div>
            <v-btn small dark text @click="$log.close">
              <v-icon small>mdi-close</v-icon>
              <small class="ml-2">close log</small>
            </v-btn>
          </div>
          <div class="logs scrollable-y show-scroll">
            <div
              v-for="log in $log.logs"
              :class="log.type+'-type'"
              :key="log.id"
              class="py-1 log-message"
            >
              <div class="d-flex justify-content-between px-2">
                <small class="log-label text-uppercase">
                  <v-icon :color="logIconColor(log.type)" small>{{logIcon(log.type)}}</v-icon>
                </small>
                <div class="d-flex flex-wrap mx-1 flex-grow-1">
                  <span
                    class="ml-1 mr-1"
                    v-for="(message,i) in log.items"
                    :key="log.id+i"
                  >{{message}} {{log.items.length != i + 1 ? ',':''}}</span>
                </div>
                <small class="date px-2 timestamp">{{log.date | date}}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  methods: {
    logIcon(type) {
      if (type === 'error') {
        return 'mdi-close-circle'
      }
      return type === 'warn' ? 'mdi-alert' : 'mdi-chevron-right'
    },
    logIconColor(type) {
      if (type === 'error') {
        return 'error'
      }
      return type === 'warn' ? 'warning' : 'teal'
    },
  },
  filters: {
    date(val) {
      try {
        return new Date(val).toLocaleTimeString()
      } catch (e) { }
    }
  }
}
</script>

<style lang="scss" scoped>
.logger-container {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 50vh;
  background: #313030;
  z-index: 999999;
  color: #e9e9e9;
  font-family: "Roboto";
  font-size: smaller;
}
.logs {
  max-height: 50vh;
  padding-bottom: 3rem;
}
.warn-type {
  background: rgba(117, 85, 3, 0.473);
  border-color: palegoldenrod;
  color: palegoldenrod;
}
.error-type {
  background: rgba(117, 3, 3, 0.473) !important;
  border-color: rgb(238, 170, 170);
  color: rgb(238, 170, 170);
}
.log-type {
  background: rgba(3, 117, 117, 0.137) !important;
  border-color: rgb(107, 107, 107);
  color: rgb(224, 239, 241);
}
.log-message {
  transition: all 0.2s linear;
  border-bottom: 0.25px solid;
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  .timestamp {
    min-width: 80px;
  }
}
</style>
