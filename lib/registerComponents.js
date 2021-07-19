import { Logger } from './monitoring/Logger'
import { QComponents } from './componentLoader'
export function registerQComponents(config, app, debug) {
  Object.keys(QComponents).forEach(option => {
    const o = config[option]
    if (!o) { return }
    Object.keys(QComponents[option]).forEach(componentName => {
      const component = QComponents[option][componentName]
      if (o[componentName]) { return false }
      if (debug) {
        Logger.log('REGISTERING COMPONENT', componentName)
      }
      app.component(componentName, component)
    })
  })
}
