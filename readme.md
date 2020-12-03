### Install QuickVue

```shell
npm i @bcwdev/quickvue
```

**_app.js_**

```html
<template>
  <div id="app">
    <!-- 
      location="top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center" 
      -->
    <toaster location="top-right" />
    <div class="loader" v-if="loading"></div>
    <router-view />
  </div>
</template>
```

### Demo
```html
<template>
  <div class="home container text-left">
    <h1>QuickVue Component Use Demo</h1>

    <div>
      <p>Bound Input: {{ state.text }}</p>
      <QInput v-model="state.text" label="the label" hint="you can add some hint text" />
    </div>

    <Lockable permissions="view:experimental" color="var(--danger)" title="Experimental" icon="mdi-flask">
      <div class="row my-3">
        <div class="col-md-4" v-for="n in 3" :key="n">
          <div class="card p-2 skeleton-loader">
            <div class="img skeleton-loader"></div>
            <div class="card-title p-2">
              <div class="d-flex align-items-center">
                <div class="skeleton-loader avatar"></div>
                <div class="skeleton-loader text mx-2"></div>
              </div>
            </div>
            <div class="card-body border-top">
              <div class="skeleton-loader text block"></div>
              <div class="skeleton-loader text block"></div>
              <div class="skeleton-loader text"></div>
            </div>
          </div>
        </div>
      </div>
    </Lockable>
    <QMenu>
      <template #trigger>
        <QBtn class="btn-dark text-white">
          button with menu
        </QBtn>
      </template>
      <QList>
        <QListItem
          v-for="n in 5"
          :key="n"
        >
          <div>{{ n }}</div>
        </QListItem>
      </QList>
    </QMenu>

    <QBtn bottom="55px" right="15px" class="fab btn-primary elevation-4" @click="state.openModal = !state.openModal">
      <QIcon icon="mdi-cog" />
    </QBtn>

    <QDialog title="Device Settings"
             :transition="UTILS.isMobile ? 'slideY': 'fade'"
             :fullscreen="UTILS.isMobile"
             :open="state.openModal"
             @close="state.openModal = false"
    >
      <div>
        <h1>Here is some more content</h1>
        <QList>
          <QListItem>
            <QSelect
              class="btn pl-5 btn-primary text-dark text-left"
              :items="state.mics"
              @select="setAudioDevice"
              :selected="state.selected.audio"
              inset-icon-p
              prepend-icon="mdi-microphone bg-primary text-white h-100 px-2 rounded-left square-right"
              label="Microphone"
              item-text="label"
            />
          </QListItem>
          <QListItem>
            <QSelect
              class="btn btn-primary text-dark pl-5 text-left"
              :items="state.cameras"
              @select="setVideoDevice"
              :selected="state.selected.video"
              inset-icon-p
              prepend-icon="mdi-video bg-primary text-white h-100 px-2 rounded-left square-right"
              label="Camera"
              hint="by default items with a name property don't need to specify the label property"
            />
          </QListItem>
        </QList>
      </div>
    </QDialog>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { UTILS } from '@bcwdev/quickvue'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      text: 'a simple message',
      mics: [{ label: 'mic 1' }, { label: 'mic 2' }],
      cameras: [{ name: 'cam 1' }, { name: 'cam 2' }],
      selected: {
        audio: {},
        video: {}
      },
      openModal: false
    })
    return {
      state,
      UTILS,
      setAudioDevice(device) {
        state.selected.audio = device
      },
      setVideoDevice(device) {
        state.selected.video = device
      }
    }
  }
}
</script>
```