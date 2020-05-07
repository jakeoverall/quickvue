import Toaster from "./lib/components/Notifications/Toaster.vue";
import QuickCollapse from "./lib/components/QuickCollapse.vue";
import QuickModal from "./lib/components/QuickModal.vue";
import QuickView from "./lib/components/QuickView.vue";
import QuickToast from "./lib/components/QuickToast.vue";
import QuickTip from "./lib/components/QuickTip.vue";
import LoggerComponent from "./lib/components/Logger.vue";
import swal from "sweetalert2";
import LP from "lightpath";
export * from "./lib/components/Notifications/NotificationService";
export * from './lib/Logger'

import {
  toastError,
  toast,
  toastInfo,
  toastSuccess,
  toastWarning
} from "./lib/components/Notifications/NotificationService";
import { $confirm, $connectionMonitor } from "./lib/utils";
import { $debounce } from "./lib/debounced";
import { Logger } from "./lib/Logger";

export const QuickVue = {
  install(Vue) {
    Vue.component("toaster", Toaster);
    Vue.component("quick-modal", QuickModal);
    Vue.component("quick-collapse", QuickCollapse);
    Vue.component("quick-view", QuickView);
    Vue.component("quick-toast", QuickToast);
    Vue.component("quick-tip", QuickTip);
    Vue.component("logger", LoggerComponent)
    Vue.prototype.$debounce = $debounce;
    Vue.prototype.$confirm = $confirm;
    Vue.prototype.$swal = swal;
    Vue.prototype.$toast = {
      custom: toast,
      error: toastError,
      info: toastInfo,
      success: toastSuccess,
      warning: toastWarning
    };
    Vue.prototype.$connectionMonitor = $connectionMonitor
    Vue.prototype.$resource = LP;
    Object.defineProperty(Vue.prototype, '$log', {
      get: () => Logger
    })
    Vue.observable(Logger)
  }
};

export const LightPath = LP;
