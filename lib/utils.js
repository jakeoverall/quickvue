import { computed, reactive, ref } from '@vue/runtime-core'
import swal from 'sweetalert2'
import { $debounce, $purgeDebounce } from './debounced'
import { Logger } from './monitoring/Logger'

async function $confirm(title = 'Are you sure?', text = "You won't be able to revert this!") {
  try {
    const config = {
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }
    const result = await swal.fire(config)
    return result.value
  } catch (e) {
    return false
  }
}

function $connectionMonitor(
  // @ts-ignore
  onConnect = (elem) => { },
  // @ts-ignore
  onDisconnect = (elem) => { }
) {
  try {
    const monitorElem = document.createElement('div')
    monitorElem.className = 'connection-monitor initialized'
    document.body.appendChild(monitorElem)

    window.ononline = () => {
      monitorElem.classList.add('connected')
      monitorElem.innerText = 'Connection Established'
      onConnect(monitorElem)
    }
    window.onoffline = () => {
      monitorElem.classList.remove('connected')
      monitorElem.classList.add('disconnected')
      monitorElem.innerText = 'Connection Lost'
      onDisconnect(monitorElem)
    }
  } catch (e) {
    Logger.error('SOMETHING FAILED IN $connectionMonitor', e)
  }
}

const windowWidth = ref(window.innerWidth)
window.addEventListener('resize', () => { windowWidth.value = window.innerWidth })

async function $prompt(title, config) {
  config = config || {
    showCancelButton: true,
    reverseButtons: true,
    inputAutoTrim: true,
    inputValidator(inputValue) {
      if (!inputValue) { return 'You must provide a response' }
    }
  }
  // @ts-ignore
  return new Promise((resolve, reject) => {
    swal.fire({
      text: title,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'ok',
      ...config
    }).then(res => {
      resolve(res.value)
    })
  })
}

// @ts-ignore
function $copyToClipboard(text) {
  let copyElem = document.getElementById('__copy__')
  if (!copyElem) {
    copyElem = document.createElement('textarea')
    copyElem.style.position = 'fixed'
    copyElem.style.left = '-999999px'
    document.body.appendChild(copyElem)
  }

  // @ts-ignore
  copyElem.value = text
  // @ts-ignore
  copyElem.select()
  // @ts-ignore
  copyElem.setSelectionRange(0, 99999)
  document.execCommand('copy')
  setTimeout(() => {
    document.body.removeChild(copyElem)
  }, 150)
}

const $swal = swal

function $addOrUpdate(arr, item, append = false) {
  if (!item) { return }
  const i = arr.findIndex(i => i.id === item.id)
  i === -1 ? (append ? arr.push(item) : arr.unshift(item)) : arr.splice(i, 1, item)
}
function $remove(arr, item) {
  if (!item) { return }
  const i = arr.findIndex(i => i.id === item.id)
  if (i !== -1) { arr.splice(i, 1) }
}

export const UTILS = reactive({
  isMobile: computed(() => windowWidth.value < 600),
  $copyToClipboard,
  $confirm,
  $connectionMonitor,
  $debounce,
  $purgeDebounce,
  $prompt,
  $addOrUpdate,
  $remove,
  $swal
})
