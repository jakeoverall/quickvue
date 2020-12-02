import { reactive } from 'vue'

function log(type, args) {
  // eslint-disable-next-line no-console
  if (location.origin.includes('localhost') && console[type]) {
    // eslint-disable-next-line no-console
    console[type](...args)
  }
  const logItem = {
    id: `${Math.floor(Math.random() * 999999)}_${Math.floor(Math.random() * 999999)}`,
    date: Date.now(),
    items: [],
    objects: [],
    type
  }
  // @ts-ignore
  Object.values(args).map(val => {
    if (typeof val === 'string') {
      logItem.items.push(val)
    } else if (val.message) {
      logItem.items.push(val.message)
    }
    if (typeof val === 'object') {
      logItem.objects.push(val)
      logItem.items.push(JSON.stringify(val))
    }
  })
  Logger.logs.push(logItem)
}

export const Logger = reactive({
  visible: false,
  logs: [],
  error() { log('error', arguments) },
  warn() { log('warn', arguments) },
  log() { log('log', arguments) },
  info() { log('info', arguments) },
  clear() { Logger.logs = [] },
  open() { Logger.visible = true },
  close() { Logger.visible = false }
})
