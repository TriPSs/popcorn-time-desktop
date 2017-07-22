// @flow
import * as Constants from './TorrentConstants'

export default (state = Constants.INITIAL_STATE, action) => {

  switch (action.type) {
    case Constants.UPDATE_STATUS:
      return {
        ...state,
        status: action.payload.newStatus,
      }

    default:
      return state

  }
}
