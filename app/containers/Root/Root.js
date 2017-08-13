// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import 'styles/core.global.scss'
import Routes from 'routes'
import type { Props } from './RootTypes'

export default class extends React.Component {

  props: Props

  componentWillMount() {
    const { bookmarks } = this.props

    bookmarks.getBookmarks()
  }

  render() {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    )
  }
}
