import { connect } from 'react-redux'

import * as WatchedActions from './WatchedActions'

import WatchedComponent from './WatchedComponent'

export default connect(null, { ...WatchedActions })(WatchedComponent)
