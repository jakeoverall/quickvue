import { reactive } from '@vue/runtime-core'

function log(type, args) {
  // eslint-disable-next-line no-console
  if (location.origin.includes('localhost') && typeof console[type] === 'function') {
    // eslint-disable-next-line no-console
    console[type](`[${type}] :: ${new Date().toLocaleTimeString()} :: `, ...args)
  // eslint-disable-next-line no-console
  } else if (typeof console[type] === 'function') {
    switch (type) {
      case 'log':
      case 'assert':
        return
    }
    // eslint-disable-next-line no-console
    console[type](`[${type}] :: ${new Date().toLocaleTimeString()} :: `, ...args)
  }
  const logItem = {
    id: `${Math.floor(Math.random() * 999999)}_${Math.floor(Math.random() * 999999)}`,
    date: Date.now(),
    items: [],
    objects: [],
    type
  }
  // @ts-ignore
  Object.values(args).forEach(val => {
    if (typeof val === 'string') {
      logItem.items.push(val)
    } else if (val.message) {
      logItem.items.push(val.message)
    }
    if (typeof val === 'object') {
      logItem.objects.push(val)
      logItem.items.push(JSON.stringify(val, getCircularReplacer(), 2))
    }
  })
  Logger.logs.push(logItem)
}

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }
    return value
  }
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
