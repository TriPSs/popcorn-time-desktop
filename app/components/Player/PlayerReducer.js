// @flow
import * as Constants from './PlayerConstants'

export default (state = Constants.INITIAL_STATE, action) => {

  switch (action.type) {
    case Constants.PLAYER_PLAY:
    case Constants.PLAYER_PAUSE:
    case Constants.PLAYER_STOP:
      return {
        ...state,
        ...action.payload,
        status: action.type,
      }

    case Constants.UPDATE_PLAYER_TYPE:
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state

  }
}
