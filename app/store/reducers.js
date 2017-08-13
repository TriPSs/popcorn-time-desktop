import { combineReducers } from 'redux'

import * as PlayerConstants from 'api/Player/PlayerConstants'
import PlayerReducer from 'api/Player/PlayerReducer'

import * as TorrentConstants from 'api/Torrent/TorrentConstants'
import TorrentReducer from 'api/Torrent/TorrentReducer'

import * as HomeConstants from '../routes/Home/HomeConstants'
import HomeReducer from '../routes/Home/HomeReducer'

import * as ItemConstants from '../routes/Item/ItemConstants'
import ItemReducer from '../routes/Item/ItemReducer'

import * as BookmarkedConstants from '../components/Bookmarked/BookmarkedConstants'
import BookmarkedReducer from '../components/Bookmarked/BookmarkedReducer'

export default combineReducers({
  [HomeConstants.REDUCER_NAME]      : HomeReducer,
  [ItemConstants.REDUCER_NAME]      : ItemReducer,
  [PlayerConstants.REDUCER_NAME]    : PlayerReducer,
  [BookmarkedConstants.REDUCER_NAME]: BookmarkedReducer,
  [TorrentConstants.REDUCER_NAME]   : TorrentReducer,
})
