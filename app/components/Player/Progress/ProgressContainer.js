import { connect } from 'react-redux'

import * as PlayerSelectors from 'api/Player/PlayerSelectors'

import Progress from './Progress'

export const mapStateToProps = state => ({
  item: PlayerSelectors.getItem(state),
})

export default connect(mapStateToProps)(Progress)
