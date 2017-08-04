import { connect } from 'redux-clazz'
import { updatePercentage } from 'components/Watched/WatchedActions'

import Player from './PlyrPlayerProvider'

import { updateStatus } from '../PlayerActions'

export default connect(null, { updateStatus, updatePercentage })(Player)
