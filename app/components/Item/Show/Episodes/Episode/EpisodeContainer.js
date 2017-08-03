import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import * as TorrentSelectors from 'api/Torrent/TorrentSelectors'

import * as ItemSelectors from 'components/Item/ItemSelectors'

import Episode from './Episode'

export const mapDispatchToProps = dispatch => ({
  player: bindActionCreators(PlayerActions, dispatch),
})

export const mapStateToProps = state => ({
  item                   : ItemSelectors.getItem(state),
  playerStatus           : PlayerSelectors.getStatus(state),
  torrentStatus          : TorrentSelectors.getStatus(state),
  fetchingEpisodeTorrents: ItemSelectors.getFetchingEpisodeTorrents(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Episode)
