// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import Routes from '../routes'

type RootType = {
  store: Object,
  history: Object
}

export default ({ store, history }: RootType) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
)

