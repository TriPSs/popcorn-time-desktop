import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as PlayerActions from 'components/Player/PlayerActions'
import * as PlayerSelectors from 'components/Player/PlayerSelectors'

import * as Actions from './ItemActions'
import * as Selectors from './ItemSelectors'

import Item from './ItemComponent'

export const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(Actions, dispatch),
  player: bindActionCreators(PlayerActions, dispatch),
})

export const mapStateToProps = state => ({
  item        : Selectors.getItem(state),
  isLoading   : Selectors.getIsLoading(state),
  playerStatus: PlayerSelectors.getPlayerStatus(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)
