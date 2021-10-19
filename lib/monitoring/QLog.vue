<template>
  <div>
    <Transition name="slideY">
      <div v-if="open" class="logger-container elevation-4" :class="theme">
        <div class="logger-view">
          <div
            class="
              top-bar
              border-bottom
              text-white
              d-flex
              justify-content-between
            "
          >
            <div class="d-flex align-items-center">
              <QBtn class="text-white" @click="clear">
                <QIcon icon="mdi-cancel" />
                <span class="ml-2">clear log</span>
              </QBtn>
              <slot name="topBar"></slot>
            </div>
            <QBtn class="text-white" @click="close">
              <QIcon icon="mdi-close" />
              <span class="ml-2">close</span>
            </QBtn>
          </div>
          <div class="logs scrollable-y show-scroll">
            <div
              v-for="entry in list"
              :class="entry.type + '-type'"
              :key="entry.id"
              class="py-1 log-message"
            >
              <div class="d-flex justify-content-between px-2">
                <small class="log-label text-uppercase">
                  <QIcon
                    :class="logIconColor(entry.type)"
                    small
                    :icon="logIcon(entry.type)"
                  />
                </small>
                <div
                  class="d-flex flex-wrap mx-1 flex-grow-1"
                  style="
                    width: 80vw;
                    white-space: pre-line;
                    word-break: break-word;
                  "
                >
                  <div
                    class="ml-1 mr-1"
                    v-for="(message, i) in entry.items"
                    :key="entry.id + i"
                  >
                    <QCollapse v-if="message.startsWith('{')">
                      <template #trigger="{ show }">
                        <QBtn class="text-white">
                          <QIcon
                            :icon="show ? 'mdi-minus' : 'mdi-chevron-down'"
                          />
                          <span class="ml-2"
                            >[OBJECT {{ message.slice(0, 5) }}]</span
                          >
                        </QBtn>
                      </template>
                      <div class="p-3 bg-dark text-white rounded">
                        {{ message }}
                      </div>
                    </QCollapse>
                    <span v-else
                      >{{ message
                      }}{{ entry.items.length != i + 1 ? ", " : "" }}</span
                    >
                  </div>
                </div>
                <span class="date px-2 timestamp">{{ date(entry.date) }}</span>
              </div>
            </div>
          </div>
          <div class="bottom-bar text-white d-flex align-items-center">
            <QMenu close-on-click>
              <template #trigger>
                <QBtn class="text-white mr-1 text-capitalize">
                  theme: {{ theme }}
                </QBtn>
              </template>
              <div class="bg-dark w-100 text-white elevation-4">
                <QList class="scrollable-y no-select py-0">
                  <QListItem
                    class="selectable dark text-capitalize"
                    v-for="theme in themes"
                    :key="theme"
                    @click="changeTheme(theme)"
                  >
                    {{ theme }}
                  </QListItem>
                </QList>
              </div>
            </QMenu>
            <slot name="bottomBar" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

export default {
  props: {
    show: { type: Boolean, required: true },
    log: { type: Array, default() { return [] } }
  },
  setup(props, { emit }) {
    const THEME_KEY = 'logger_theme'
    const theme = ref(localStorage.getItem(THEME_KEY) || 'default')
    const open = ref(false)
    watchEffect(() => {
      open.value = props.show
    })

    return {
      open,
      theme,
      themes: ['default', 'dracula'],
      list: computed(() => [...props.log]),
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
      date(val) {
        try {
          return new Date(val).toLocaleTimeString()
        } catch (e) { }
      },
      changeTheme(t) {
        theme.value = t
        localStorage.setItem(THEME_KEY, t)
      },
      close() {
        open.value = false
        emit('closed')
      },
      clear() {
        emit('clear')
      }

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
  z-index: 4;
  color: #e9e9e9;
  font-size: smaller;
  .top-bar {
    height: 40px;
  }
  .logs {
    height: calc(50vh - 70px);
    padding-bottom: 3rem;
    .log-message {
      transition: all 0.2s linear;
      border-bottom: 0.25px solid;
      line-height: 1.75rem;
      cursor: pointer;
      &:hover {
        filter: brightness(1.2);
      }
      .timestamp {
        min-width: 80px;
      }
    }
  }
  .bottom-bar {
    height: 30px;
    font-size: 12pt;
    overflow: hidden;
  }

  &::before {
    content: "";
    background: transparent;
    transition: all 0.25s linear;
    position: absolute;
    cursor: pointer;
    pointer-events: none;
    bottom: 0;
    left: -100px;
    z-index: 2;
    height: 30px;
    display: flex;
    align-items: center;
  }

  &.default {
    background: #1e1e1e;
    color: whitesmoke;
    .top-bar {
      background: #2d2d2d;
    }
    .bottom-bar {
      background: #cc6633;
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
    .info-type {
      background: rgba(3, 117, 117, 0.137) !important;
      border-color: rgb(107, 107, 107);
      color: rgb(224, 239, 241);
    }
  }

  &.dracula {
    background: #22212c;
    font-family: "Fira Code", monospace;
    color: whitesmoke;
    .top-bar {
      background: #2b2640;
    }
    .bottom-bar {
      background: #130f09;
    }
    .warn-type {
      color: #f0f07a;
    }
    .error-type {
      color: #ff80bf;
    }
    .info-type {
      color: #72e2d1;
    }
    .log-type {
      color: #80e877;
    }
    &::before {
      content: "🧛‍♂️ Dracula";
      background: #c06595;
      font-size: 17px;
      padding: 0 1.85rem;
      left: 0;
    }
    .show-scroll.logs::-webkit-scrollbar-thumb,
    .show-scroll.logs *::-webkit-scrollbar-thumb {
      background: #f0f07a;
    }
    .show-scroll.logs::-webkit-scrollbar-track,
    .show-scroll.logs *::-webkit-scrollbar-track {
      background: #130f09;
    }
  }
}
</style>
