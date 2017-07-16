import { connect } from 'react-redux'

import * as ItemSelectors from '../Item/ItemSelectors'
import * as Actions from './PlayerActions'
import * as Selectors from './PlayerSelectors'

import Player from './PlayerComponent'

export const mapStateToProps = state => ({
  uri           : Selectors.getUri(state),
  item          : ItemSelectors.getItem(state),
  playerAction  : Selectors.getPlayerAction(state),
  playerStatus  : Selectors.getPlayerStatus(state),
  playerProvider: Selectors.getPlayerProvider(state),
  devices       : Selectors.getDevices(state),
})

export default connect(mapStateToProps, { ...Actions })(Player)
