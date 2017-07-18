// @flow
import * as Constants from './BookmarkedConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCHED_BOOKMARKS:
      return {
        ...state,
        bookmarks: action.payload,
      }

    case Constants.ADD_BOOKMARK:
      return {
        ...state,
        bookmarks: [
          ...state.bookmarks,
          action.payload.id,
        ],
      }

    case Constants.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => bookmark !== action.payload),
      }

    default:
      return state

  }
}
