import '@mdi/font/css/materialdesignicons.css'
import { Logger } from './lib/monitoring/Logger'
import { registerQComponents } from './lib/registerComponents'
export * from './lib/utils'
export * from './lib/NotificationService'
export * from './lib/monitoring/Logger'
export * from './lib/DateFilters'

export const QuickVue = {
  install(app, config = {
    composable: true,
    drive: true,
    components: true,
    monitoring: true
  }, debug = false) {
    try {
      registerQComponents(config, app, debug)
    } catch (e) {
      Logger.error('UNABLE TO LOAD COMPONENTS', e)
    }
  }
}
