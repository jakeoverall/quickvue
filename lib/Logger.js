function log(type, args) {
  if (location.origin.includes('localhost') && console[type]) {
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
    }
  })
  Logger.logs.push(logItem)
}

export const Logger = {
  visible: false,
  logs: [],
  error() { log('error', arguments) },
  warning() { log('warn', arguments) },
  message() { log('log', arguments) },
  clear() { Logger.logs = [] },
  open() { Logger.visible = true },
  close() { Logger.visible = false }
}
