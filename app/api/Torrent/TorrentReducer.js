// @flow
import * as Constants from './TorrentConstants'

export default (state = Constants.INITIAL_STATE, action) => {

  switch (action.type) {
    case Constants.UPDATE_STATUS:
      return {
        ...state,
        status: action.payload.newStatus,
        stats: Constants.INITIAL_STATE.stats,
      }

    case Constants.BUFFERING:
    case Constants.DOWNLOADING:
      return {
        ...state,
        stats: action.payload,
      }

    default:
      return state

  }
}
