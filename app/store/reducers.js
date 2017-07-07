import { combineReducers } from 'redux'

import * as HomeConstants from '../components/Home/HomeConstants'
import HomeReducer from '../components/Home/HomeReducer'

import * as ItemConstants from '../components/Item/ItemConstants'
import ItemReducer from '../components/Item/ItemReducer'

import * as PlayerConstants from '../components/Player/PlayerConstants'
import PlayerReducer from '../components/Player/PlayerReducer'

export default combineReducers({
  [HomeConstants.REDUCER_NAME]  : HomeReducer,
  [ItemConstants.REDUCER_NAME]  : ItemReducer,
  [PlayerConstants.REDUCER_NAME]: PlayerReducer,
})