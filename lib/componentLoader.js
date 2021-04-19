// COMPONENTS
import QContextMenu from './components/QContextMenu.vue'
import QToaster from './components/QToaster.vue'
import QCollapse from './components/QuickCollapse.vue'
import QView from './components/QuickView.vue'
import QToast from './components/QuickToast.vue'
import QTip from './components/QuickTip.vue'
import QMarkdown from './components/QMarkdown.vue'
import QPaginator from './components/QPaginator.vue'
import QSortable from './components/QSortable.vue'
import QWidget from './components/QWidget.vue'
// COMPOSABLES
import QAsync from './composable/QAsync.vue'
import QAutoComplete from './composable/QAutoComplete.vue'
import QCheckbox from './composable/QCheckbox.vue'
import QBtn from './composable/QBtn.vue'
import QDate from './composable/QDate.vue'
import QDialog from './composable/QDialog.vue'
import QDialogCard from './composable/QDialogCard.vue'
import QEditableField from './composable/QEditableField.vue'
import QIcon from './composable/QIcon.vue'
import QImg from './composable/QImg.vue'
import QInput from './composable/QInput.vue'
import QList from './composable/QList.vue'
import QListItem from './composable/QListItem.vue'
import QMenu from './composable/QMenu.vue'
import QSelect from './composable/QSelect.vue'
// DRIVE
import Drive from './drive/Drive.vue'
import DriveFile from './drive/DriveFile.vue'
import DriveFileContextMenu from './drive/DriveFileContextMenu.vue'
import DriveFileDetails from './drive/DriveFileDetails.vue'
import DriveFilePreview from './drive/DriveFilePreview.vue'
import DriveFileUploader from './drive/DriveFileUploader.vue'
import DriveFolder from './drive/DriveFolder.vue'
import DriveNavCrumbs from './drive/DriveNavCrumbs.vue'
import DriveTree from './drive/DriveTree.vue'
import DriveTreeFolder from './drive/DriveTreeFolder.vue'

// MONITORING
import QLog from './monitoring/QLog.vue'

const components = {
  QContextMenu,
  QMarkdown,
  QPaginator,
  QSortable,
  QToaster,
  QCollapse,
  QTip,
  QToast,
  QView,
  QWidget
}
const composable = {
  QAsync,
  QAutoComplete,
  QCheckbox,
  QBtn,
  QDate,
  QDialog,
  QDialogCard,
  QEditableField,
  QIcon,
  QImg,
  QInput,
  QList,
  QListItem,
  QMenu,
  QSelect
}
const drive = {
  Drive,
  DriveFile,
  DriveFileContextMenu,
  DriveFileDetails,
  DriveFilePreview,
  DriveFileUploader,
  DriveFolder,
  DriveNavCrumbs,
  DriveTree,
  DriveTreeFolder
}
const monitoring = {
  QLog
}

export const QComponents = {
  components,
  composable,
  drive,
  monitoring
}
