import Toaster from './components/Notifications/Toaster.vue'
import QuickCollapse from './components/QuickCollapse.vue'
import QuickModal from './components/QuickModal.vue'
import QuickView from './components/QuickView.vue'
import QuickToast from './components/QuickToast.vue'

export * from "./components/Notifications/NotificationService"

export const QuickVue = {
  install(Vue) {
    Vue.component('toaster', Toaster)
    Vue.component('quick-modal', QuickModal)
    Vue.component('quick-collapse', QuickCollapse)
    Vue.component('quick-view', QuickView)
    Vue.component('quick-toast', QuickToast)
  },

  /**
  * A simple debounce function timeout is (ms)
  * @param {function} callback 
  * @param {number} timeout 
  */
  debounce(callback, timeout) {
    let id;
    return (...args) => {
      clearTimeout(id);
      return id = setTimeout(() => callback(...args), timeout);
    };
  }
}