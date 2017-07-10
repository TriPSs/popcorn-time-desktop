import { connect } from 'react-redux'
import * as HomeActions from '../Home/HomeActions'
import * as HomeSelectors from '../Home/HomeSelectors'

import Header from './HeaderComponent'

export const mapStateToProps = state => ({
  activeMode: HomeSelectors.getActiveMode(state),
})

export default connect(mapStateToProps, { ...{ setActiveMode: HomeActions.setActiveMode } })(Header)
