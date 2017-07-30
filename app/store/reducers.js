import { combineReducers } from 'redux'

import * as PlayerConstants from 'api/Player/PlayerConstants'
import PlayerReducer from 'api/Player/PlayerReducer'

import * as TorrentConstants from 'api/Torrent/TorrentConstants'
import TorrentReducer from 'api/Torrent/TorrentReducer'

import * as HomeConstants from '../components/Home/HomeConstants'
import HomeReducer from '../components/Home/HomeReducer'

import * as ItemConstants from '../components/Item/ItemConstants'
import ItemReducer from '../components/Item/ItemReducer'

import * as BookmarkedConstants from '../components/Bookmarked/BookmarkedConstants'
import BookmarkedReducer from '../components/Bookmarked/BookmarkedReducer'

import * as WatchedConstants from '../components/Watched/WatchedConstants'
import WatchedReducer from '../components/Watched/WatchedReducer'

export default combineReducers({
  [HomeConstants.REDUCER_NAME]      : HomeReducer,
  [ItemConstants.REDUCER_NAME]      : ItemReducer,
  [PlayerConstants.REDUCER_NAME]    : PlayerReducer,
  [BookmarkedConstants.REDUCER_NAME]: BookmarkedReducer,
  [TorrentConstants.REDUCER_NAME]   : TorrentReducer,
  [WatchedConstants.REDUCER_NAME]   : WatchedReducer,
})
