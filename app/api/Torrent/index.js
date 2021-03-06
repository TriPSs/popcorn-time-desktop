import { connect } from 'redux-clazz'
import Torrent from './Torrent'

import * as TorrentActions from './TorrentActions'
import * as TorrentSelectors from './TorrentSelectors'

export const mapStateToProps = state => ({
  status: TorrentSelectors.getStatus(state),
})

export default connect(mapStateToProps, TorrentActions, true)(Torrent)
