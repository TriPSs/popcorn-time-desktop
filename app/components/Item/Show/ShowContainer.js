import { connect } from 'react-redux'

import * as PlayerSelectors from 'api/Player/PlayerSelectors'
import { searchEpisodeTorrents } from '../ItemActions'
import * as Selectors from '../ItemSelectors'

import Show from './Show'

export const mapStateToProps = state => ({
  item                   : Selectors.getItem(state),
  fetchingEpisodeTorrents: Selectors.getFetchingEpisodeTorrents(state),
  playerStatus           : PlayerSelectors.getStatus(state),
})

export default connect(mapStateToProps, { searchEpisodeTorrents })(Show)
