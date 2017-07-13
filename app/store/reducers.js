import { combineReducers } from 'redux'

import * as HomeConstants from '../components/Home/HomeConstants'
import HomeReducer from '../components/Home/HomeReducer'

import * as ItemConstants from '../components/Item/ItemConstants'
import ItemReducer from '../components/Item/ItemReducer'

import * as PlayerConstants from '../components/Player/PlayerConstants'
import PlayerReducer from '../components/Player/PlayerReducer'

import * as BookmarkedConstants from '../components/Bookmarked/BookmarkedConstants'
import BookmarkedReducer from '../components/Bookmarked/BookmarkedReducer'

export default combineReducers({
  [HomeConstants.REDUCER_NAME]      : HomeReducer,
  [ItemConstants.REDUCER_NAME]      : ItemReducer,
  [PlayerConstants.REDUCER_NAME]    : PlayerReducer,
  [BookmarkedConstants.REDUCER_NAME]: BookmarkedReducer,
})
