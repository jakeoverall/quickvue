import { Logger } from './monitoring/Logger'
import { QComponents } from './componentLoader'
export function registerQComponents(config, app, debug) {
  Object.keys(QComponents).forEach(option => {
    if (!config[option]) { return }
    Object.keys(QComponents[option]).forEach(componentName => {
      const component = QComponents[option][componentName]
      if (debug) {
        Logger.log('REGISTERING COMPONENT', componentName)
      }
      app.component(componentName, component)
    })
  })
}
