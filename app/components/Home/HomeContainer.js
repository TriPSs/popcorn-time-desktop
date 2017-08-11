import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as BookmarkActions from '../Bookmarked/BookmarkedActions'
import * as Actions from './HomeActions'
import * as Selectors from './HomeSelectors'

import Home from './HomeComponent'

export const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(Actions, dispatch),
  bookmarks: bindActionCreators(BookmarkActions, dispatch),
})

export const mapStateToProps = state => ({
  modes    : Selectors.getModes(state),
  isLoading: Selectors.getIsLoading(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
