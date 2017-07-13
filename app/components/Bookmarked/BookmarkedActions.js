import Database from 'api/Database'
import * as Constants from './BookmarkedConstants'
import * as Selectors from './BookmarkedSelectors'

export function isBookmarked(id, bookmarks) {
  return bookmarks.indexOf(id) > -1
}

export function getBookmarks() {
  return (dispatch) => {
    return Database.bookmarks.getAll().then((bookmarks) => {
      dispatch({
        type   : Constants.FETCHED_BOOKMARKS,
        payload: bookmarks,
      })
    })
  }
}

export function toggleBookmark(id, type) {
  return (dispatch, getState) => {
    if (!isBookmarked(id, Selectors.getBookmarkes(getState()))) {
      return Database.bookmarks.add(id, type).then(() => {
        dispatch({
          type   : Constants.ADD_BOOKMARK,
          payload: id,
        })
      })
    }

    return Database.bookmarks.remove(id, type).then(() => {
      dispatch({
        type   : Constants.REMOVE_BOOKMARK,
        payload: id,
      })
    })
  }
}
