import { createHashHistory } from 'history'
import createStore from './configureStore'

export const history = createHashHistory()
export const store   = createStore()
console.log(store)
export default store
