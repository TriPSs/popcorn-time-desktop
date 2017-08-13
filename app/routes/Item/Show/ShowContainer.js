import { connect } from 'react-redux'

import { selectSeasonAndEpisode } from '../ItemActions'
import * as Selectors from '../ItemSelectors'

import Show from './Show'

export const mapStateToProps = state => ({
  item           : Selectors.getItem(state),
  selectedSeason : Selectors.getSelectedSeason(state),
  selectedEpisode: Selectors.getSelectedEpisode(state),
})

export default connect(mapStateToProps, { selectSeasonAndEpisode })(Show)
