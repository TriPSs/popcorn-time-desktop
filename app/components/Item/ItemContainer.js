/**
 * @TODO: Use waitForImages plugin to load background images and fade in on load
 */
import { connect } from 'react-redux'

import * as Actions from './ItemActions'
import * as Selectors from './ItemSelectors'

import Item from './ItemComponent'

export const mapStateToProps = state => ({
  item     : Selectors.getItem(state),
  isLoading: Selectors.getIsLoading(state),
})

export default connect(mapStateToProps, { ...Actions })(Item)
