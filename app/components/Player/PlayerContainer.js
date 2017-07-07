import { connect } from 'react-redux'

import * as Actions from './PlayerActions'
import * as Selectors from './PlayerSelectors'

import Player from './PlayerComponent'

export const mapStateToProps = state => ({
  uri       : Selectors.getUri(state),
  metadata  : Selectors.getMetadata(state),
  status    : Selectors.getStatus(state),
  playerType: Selectors.getPlayerType(state),
})

export default connect(mapStateToProps, { ...Actions })(Player)
