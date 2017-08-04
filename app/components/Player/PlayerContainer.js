import { connect } from 'react-redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import * as TorrentSelectors from 'api/Torrent/TorrentSelectors'

import Player from './PlayerComponent'

export const mapStateToProps = state => ({
  uri           : PlayerSelectors.getUri(state),
  playerAction  : PlayerSelectors.getAction(state),
  playerProvider: PlayerSelectors.getProvider(state),
  playerStatus  : PlayerSelectors.getStatus(state),
  torrentStatus : TorrentSelectors.getStatus(state),
})

export default connect(mapStateToProps, PlayerActions)(Player)
