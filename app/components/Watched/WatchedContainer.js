import { connect } from 'react-redux'
import * as Actions from './WatchedActions'
/*import * as Selectors from './BookmarkedSelectors'*/

import Watched from './WatchedComponent'

export const mapStateToProps = state => ({
  watchedItems: [],
})

export default connect(mapStateToProps, { ...Actions })(Watched)
