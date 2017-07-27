import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import * as TorrentSelectors from 'api/Torrent/TorrentSelectors'

import * as Actions from './ItemActions'
import * as Selectors from './ItemSelectors'

import Item from './ItemComponent'

export const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(Actions, dispatch),
  player: bindActionCreators(PlayerActions, dispatch),
})

export const mapStateToProps = state => ({
  item         : Selectors.getItem(state),
  isLoading    : Selectors.getIsLoading(state),
  playerStatus : PlayerSelectors.getStatus(state),
  torrentStatus: TorrentSelectors.getStatus(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)
