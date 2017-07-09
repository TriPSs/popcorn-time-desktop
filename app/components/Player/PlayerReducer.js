// @flow
import * as Constants from './PlayerConstants'

export default (state = Constants.INITIAL_STATE, action) => {

  switch (action.type) {
    case Constants.PLAYER_ACTION_PLAY:
    case Constants.PLAYER_ACTION_PAUSE:
    case Constants.PLAYER_ACTION_STOP:
      return {
        ...state,
        ...action.payload,
        playerAction: action.type,
      }

    case Constants.UPDATE_PLAYER_STATUS:
      return {
        ...state,
        playerStatus: action.payload,
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
