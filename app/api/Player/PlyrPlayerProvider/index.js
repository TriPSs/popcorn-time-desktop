import { connect } from 'redux-clazz'
import Player from './PlyrPlayerProvider'

import { updateStatus, videoAlmostDone } from '../PlayerActions'

export default connect(null, { updateStatus, videoAlmostDone })(Player)
