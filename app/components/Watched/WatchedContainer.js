import { connect } from 'react-redux'

import * as WatchedActions from './WatchedActions'
import * as WatchedSelectors from './WatchedSelectors'

import WatchedComponent from './WatchedComponent'

export const mapStateToProps = state => ({
  watchedItems: WatchedSelectors.getMoviesWatched(state),
})

export default connect(mapStateToProps, { ...WatchedActions })(WatchedComponent)
