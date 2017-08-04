import { createStore, applyMiddleware, compose } from 'redux-clazz'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'

import reducers from './reducers'

export default (initialState) => {
  const middleware = [
    thunk,
    routerMiddleware(history),
  ]

  const enhancers = []
  if (__DEV__) {
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
    /* eslint-disable */
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers')),
    )
    /* eslint-enable */
  }

  return store
}
