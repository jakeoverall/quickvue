
import { createApp } from '@vue/runtime-dom'
import { QuickVue } from '../../QuickVue'
// @ts-ignore
import App from './App.vue'
import { router } from './router'

const root = createApp(App)
QuickVue.install(root)

root
  .use(router)
  .mount('#app')
