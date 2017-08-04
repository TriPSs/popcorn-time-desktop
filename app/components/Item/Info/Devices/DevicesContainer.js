import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as PlayerActions from 'api/Player/PlayerActions'
import * as PlayerSelectors from 'api/Player/PlayerSelectors'

import Devices from './Devices'

export const mapDispatchToProps = dispatch => ({
  player: bindActionCreators(PlayerActions, dispatch),
})

export const mapStateToProps = state => ({
  devices       : PlayerSelectors.getDevices(state),
  selectedDevice: PlayerSelectors.getSelectedDevice(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Devices)
