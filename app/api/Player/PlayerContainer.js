import { connect } from 'redux-clazz'
import Player from './Player'

import * as PlayerActions from './PlayerActions'
import * as PlayerSelectors from './PlayerSelectors'
import * as TorrentSelectors from '../Torrent/TorrentSelectors'

export const mapStateToProps = state => ({
  provider     : PlayerSelectors.getProvider(state),
  action       : PlayerSelectors.getAction(state),
  uri          : PlayerSelectors.getUri(state),
  item         : PlayerSelectors.getItem(state),
  playerStatus : PlayerSelectors.getStatus(state),
  torrentStatus: TorrentSelectors.getStatus(state),
})

const MediaPlayer = connect(mapStateToProps, PlayerActions)(Player)

export default MediaPlayer
