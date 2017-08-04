import { connect } from 'redux-clazz'
import { updatePercentage } from 'components/Watched/WatchedActions'

import ChromeCast from './ChromeCastProvider'

import { updateStatus } from '../../PlayerActions'

export default connect(null, { updateStatus, updatePercentage })(ChromeCast)
