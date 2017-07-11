// @flow
import * as Constants from './ItemConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCH_ITEM:
      return {
        ...state,
        isLoading: true,
      }

    case Constants.FETCHED_ITEM:
      return {
        ...state,
        isLoading: false,
        item     : action.payload,
      }

    case Constants.FETCHED_EPISODE_TORRENTS:
      return {
        ...state,
        item: action.payload,
      }

    default:
      return state

  }
}
