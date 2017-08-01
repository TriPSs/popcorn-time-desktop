import { connect } from 'redux-clazz'

import { ItemSelectors, ItemActions } from 'components/Item'

import MetadataAdapter from './MetadataAdapter'

export const mapStateToProps = state => ({
  item: ItemSelectors.getItem(state),
})

export default connect(mapStateToProps, { updateItem: ItemActions.updateItem })(MetadataAdapter)
