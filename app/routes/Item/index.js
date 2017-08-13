import ItemContainer from './ItemContainer'
import * as ItemSelectors from './ItemSelectors'
import * as ItemActions from './ItemActions'

export {
  ItemActions,
  ItemContainer,
  ItemSelectors,
}

export default {
  exact    : true,
  strict   : true,
  path     : '/:mode/:itemId',
  component: ItemContainer,
}
