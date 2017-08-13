import HomeReducer from './HomeReducer'
import HomeContainer from './HomeContainer'
import HomeComponent from './HomeComponent'
import * as HomeConstants from './HomeConstants'
import * as HomeSelectors from './HomeSelectors'
import * as HomeActions from './HomeActions'

export {
  HomeReducer,
  HomeContainer,
  HomeComponent,
  HomeConstants,
  HomeSelectors,
  HomeActions,
}

export default {
  exact    : true,
  strict   : true,
  path     : '/:mode',
  component: HomeContainer,
}
