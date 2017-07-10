import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers'

export const history = createHashHistory()

export const configureStore = (initialState) => {
  // Redux Configuration
  const middleware = [
    thunk,
    routerMiddleware(history),
  ]

  const enhancers = []
  if (__DEV__) {
    const createLogger = require('redux-logger').createLogger

    middleware.push(createLogger({
      level    : 'info',
      collapsed: true,
      diff     : true,
    }))

    if (window !== 'undefined' && window) {
      const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

      if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
      }
    }
  }

  // Create Store
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  )

  if (__DEV__ && module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers')),
    )
  }

  return store
}

export default { configureStore, history }
