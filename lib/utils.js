import { computed, reactive, ref } from 'vue'
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
  onConnect = (elem) => { },
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

const $swal = swal

export const UTILS = reactive({
  isMobile: computed(() => windowWidth.value < 600),
  $confirm,
  $connectionMonitor,
  $debounce,
  $purgeDebounce,
  $prompt,
  $swal
})
