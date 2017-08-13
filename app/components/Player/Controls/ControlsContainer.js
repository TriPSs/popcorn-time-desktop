import { connect } from 'react-redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'

import Controls from './Controls'

export const mapStateToProps = state => ({
  playerStatus: PlayerSelectors.getStatus(state),
})

export default connect(mapStateToProps, PlayerActions)(Controls)
