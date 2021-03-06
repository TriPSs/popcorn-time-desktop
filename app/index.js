import React from 'react'
import { render as renderDOM } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { store, history } from './store'
import Root from './containers/Root'

const render = (Container = AppContainer) => renderDOM(
  <Container>
    <Root store={store} history={history} />
  </Container>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root') // eslint-disable-line global-require

    render(NextRoot)
  })
}

render()
