// @flow
import * as WatchedConstants from 'components/Watched/WatchedConstants'
import * as PlayerConstants from './PlayerConstants'
import * as TorrentConstants from '../Torrent/TorrentConstants'

export default (state = PlayerConstants.INITIAL_STATE, action) => {

  switch (action.type) {
    case PlayerConstants.ACTION_PLAY:
    case PlayerConstants.ACTION_PAUSE:
    case PlayerConstants.ACTION_CONTINUE:
    case PlayerConstants.ACTION_STOP:
      return {
        ...state,
        ...action.payload,
        action: action.type,
      }

    case PlayerConstants.UPDATE_STATUS:
      return {
        ...state,
        status: action.payload,
      }

    case PlayerConstants.UPDATE_PROVIDER:
      return {
        ...state,
        provider: action.payload,
      }

    case PlayerConstants.FOUND_DEVICES:
      return {
        ...state,
        devices: action.payload,
      }

    case PlayerConstants.SELECT_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload,
      }

    case TorrentConstants.UPDATE_STATUS:
      return {
        ...state,
        uri : action.payload.uri,
        item: action.payload.item,
      }

    case WatchedConstants.UPDATE_PERCENTAGE_EPISODE:
      return {
        ...state,
        item: {
          ...state.item,
          watched: action.payload.watched,
        },
      }

    default:
      return state

  }
}
