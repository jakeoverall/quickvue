import Toaster from './lib/components/Notifications/Toaster.vue'
import QuickCollapse from './lib/components/QuickCollapse.vue'
import QuickView from './lib/components/QuickView.vue'
import QuickToast from './lib/components/QuickToast.vue'
import QuickTip from './lib/components/QuickTip.vue'
import QLog from './lib/monitoring/QLog.vue'
import QAsync from './lib/composable/QAsync.vue'
import QBtn from './lib/composable/QBtn.vue'
import QDialog from './lib/composable/QDialog.vue'
import QIcon from './lib/composable/QIcon.vue'
import QImg from './lib/composable/QImg.vue'
import QInput from './lib/composable/QInput.vue'
import QMenu from './lib/composable/QMenu.vue'
import QList from './lib/composable/QList.vue'
import QListItem from './lib/composable/QListItem.vue'
import QSelect from './lib/composable/QSelect.vue'
import QAutoComplete from './lib/composable/QAutoComplete.vue'
import QDate from './lib/composable/QDate.vue'
import QMarkdown from './lib/components/QMarkdown.vue'
import '@mdi/font/css/materialdesignicons.css'
export * from './lib/utils'
export * from './lib/components/Notifications/NotificationService'
export * from './lib/monitoring/Logger'

export const QuickVue = {
  install(app) {
    app.component('QToaster', Toaster)
    app.component('QDialog', QDialog)
    app.component('QCollapse', QuickCollapse)
    app.component('QView', QuickView)
    app.component('QToast', QuickToast)
    app.component('QTip', QuickTip)
    app.component('QLog', QLog)
    app.component('QBtn', QBtn)
    app.component('QAsync', QAsync)
    app.component('QIcon', QIcon)
    app.component('QImg', QImg)
    app.component('QInput', QInput)
    app.component('QList', QList)
    app.component('QListItem', QListItem)
    app.component('QSelect', QSelect)
    app.component('QMenu', QMenu)
    app.component('QAutoComplete', QAutoComplete)
    app.component('QMarkdown', QMarkdown)
    app.component('QDate', QDate)
  }
}
