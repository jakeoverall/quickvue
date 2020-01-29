import Toaster from "./lib/components/Notifications/Toaster.vue";
import QuickCollapse from "./lib/components/QuickCollapse.vue";
import QuickModal from "./lib/components/QuickModal.vue";
import QuickView from "./lib/components/QuickView.vue";
import QuickToast from "./lib/components/QuickToast.vue";
import QuickTip from "./lib/components/QuickTip.vue";
import swal from "sweetalert2";
export * from "./lib/components/Notifications/NotificationService";
import LP from "lightpath";

import {
  toastError,
  toast,
  toastInfo,
  toastSuccess,
  toastWarning
} from "./lib/components/Notifications/NotificationService";
import { $debounce, $confirm } from "./lib/utils";

export const QuickVue = {
  install(Vue) {
    Vue.component("toaster", Toaster);
    Vue.component("quick-modal", QuickModal);
    Vue.component("quick-collapse", QuickCollapse);
    Vue.component("quick-view", QuickView);
    Vue.component("quick-toast", QuickToast);
    Vue.component("quick-tip", QuickTip);
    Vue.prototype.$debouce = $debounce;
    Vue.prototype.$confirm = $confirm;
    Vue.prototype.$swal = swal;
    Vue.prototype.$toast = {
      custom: toast,
      error: toastError,
      info: toastInfo,
      success: toastSuccess,
      warning: toastWarning
    };
    Vue.prototype.$resource = LP;
  }
};

export const LightPath = LP;
