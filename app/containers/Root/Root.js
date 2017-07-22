// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import 'styles/core.global.scss'
import Routes from 'routes'

type Props = {
  store: Object,
  history: Object
}

export class RootContainer extends React.Component {

  props: Props

  componentWillMount() {
    const { bookmarks, watched } = this.props

    bookmarks.getBookmarks()
    watched.getMoviesWatched()
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

export default RootContainer
