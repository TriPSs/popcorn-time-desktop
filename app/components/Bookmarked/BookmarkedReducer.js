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
          action.payload,
        ],
      }

    case Constants.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.splice(state.bookmarks.indexOf(action.payload), 1),
      }

    default:
      return state

  }
}
