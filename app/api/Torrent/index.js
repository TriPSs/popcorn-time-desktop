import { connect } from 'redux-clazz'
import Torrent from './Torrent'

import * as Actions from './TorrentActions'
import * as Selectors from './TorrentSelectors'

export const mapStateToProps = state => ({
  status: Selectors.getStatus(state),
})

const TorrentAdapter = connect(mapStateToProps, { ...Actions })(Torrent)

export default TorrentAdapter
