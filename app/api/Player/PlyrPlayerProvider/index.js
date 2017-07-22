import { connect } from 'redux-clazz'
import Player from './PlyrPlayerProvider'

import { updateStatus } from '../PlayerActions'

export default connect(null, { updateStatus })(Player)
