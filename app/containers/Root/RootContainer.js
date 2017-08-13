import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as BookmarkActions from 'components/Bookmarked/BookmarkedActions'
import Root from './Root'

export const mapDispatchToProps = dispatch => ({
  bookmarks: bindActionCreators(BookmarkActions, dispatch),
})

export default connect(null, mapDispatchToProps)(Root)
