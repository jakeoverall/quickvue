import { reactive } from '@vue/reactivity'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  account: {}
})
