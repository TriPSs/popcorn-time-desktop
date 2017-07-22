import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as BookmarkActions from 'components/Bookmarked/BookmarkedActions'
import * as WatchedActions from 'components/Watched/WatchedActions'

import Root from './Root'

export const mapDispatchToProps = dispatch => ({
  bookmarks: bindActionCreators(BookmarkActions, dispatch),
  watched  : bindActionCreators(WatchedActions, dispatch),
})

export default connect(null, mapDispatchToProps)(Root)
