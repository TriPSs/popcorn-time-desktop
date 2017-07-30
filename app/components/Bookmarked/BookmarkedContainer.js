import { connect } from 'react-redux'
import * as Actions from './BookmarkedActions'
import * as Selectors from './BookmarkedSelectors'

import BookmarkedComponent from './BookmarkedComponent'

export const mapStateToProps = state => ({
  bookmarks: Selectors.getBookmarkes(state),
})

export default connect(mapStateToProps, { ...Actions })(BookmarkedComponent)
