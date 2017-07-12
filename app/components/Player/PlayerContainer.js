import { connect } from 'react-redux'

import * as Actions from './PlayerActions'
import * as Selectors from './PlayerSelectors'

import Player from './PlayerComponent'

export const mapStateToProps = state => ({
  uri         : Selectors.getUri(state),
  metadata    : Selectors.getMetadata(state),
  playerAction: Selectors.getPlayerAction(state),
  playerStatus: Selectors.getPlayerStatus(state),
  playerProvider  : Selectors.getPlayerProvider(state),
  devices     : Selectors.getDevices(state),
})

export default connect(mapStateToProps, { ...Actions })(Player)
