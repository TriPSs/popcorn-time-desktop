import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import * as TorrentSelectors from 'api/Torrent/TorrentSelectors'

import * as ItemSelectors from 'routes/Item/ItemSelectors'
import { searchEpisodeTorrents } from 'routes/Item/ItemActions'

import Episode from './Episode'

export const mapDispatchToProps = dispatch => ({
  itemActions: bindActionCreators({ searchEpisodeTorrents }, dispatch),
  player  : bindActionCreators(PlayerActions, dispatch),
})

export const mapStateToProps = state => ({
  fetchingEpisodeTorrents: ItemSelectors.getFetchingEpisodeTorrents(state),
  item                   : ItemSelectors.getItem(state),
  playerStatus           : PlayerSelectors.getStatus(state),
  torrentStatus          : TorrentSelectors.getStatus(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Episode)
