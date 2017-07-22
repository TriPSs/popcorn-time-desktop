import { connect } from 'react-redux'

import * as Actions from 'api/Player/PlayerActions'
import * as Selectors from 'api/Player/PlayerSelectors'

import Player from './PlayerComponent'

export const mapStateToProps = state => ({
  uri         : Selectors.getUri(state),
  item        : Selectors.getItem(state),
  playerStatus: Selectors.getStatus(state),
  playerAction: Selectors.getAction(state),
})

export default connect(mapStateToProps, { ...Actions })(Player)
