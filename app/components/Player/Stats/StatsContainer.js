import { connect } from 'react-redux'

import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import * as TorrentSelectors from 'api/Torrent/TorrentSelectors'

import Stats from './Stats'

export const mapStateToProps = state => ({
  item : PlayerSelectors.getItem(state),
  stats: TorrentSelectors.getStats(state),
})

export default connect(mapStateToProps)(Stats)
