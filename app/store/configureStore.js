import { createStore, applyMiddleware, compose } from 'redux-clazz'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers'

export default (initialState) => {
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
      const devToolsExtension = window.devToolsExtension

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
