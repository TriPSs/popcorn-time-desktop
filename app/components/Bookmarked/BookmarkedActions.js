import Database from 'api/Database'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as Constants from './BookmarkedConstants'
import * as Selectors from './BookmarkedSelectors'

export function isBookmarked(id, bookmarks) {
  return bookmarks.indexOf(id) > -1
}

export function getBookmarks() {
  return (dispatch) => {
    Database.bookmarks.getAll().then((bookmarks) => {
      dispatch({
        type   : Constants.FETCHED_BOOKMARKS,
        payload: bookmarks,
      })
    })
  }
}

export function toggleBookmark(item) {
  return (dispatch, getState) => {
    const { id, type } = item

    if (!isBookmarked(id, Selectors.getBookmarkes(getState()))) {
      Database.bookmarks.add(id, type).then(() => {
        dispatch({
          type   : Constants.ADD_BOOKMARK,
          payload: {
            id,
            item,
          },
        })
      })

      // Add to database
      Database[MetadataConstants.PLURALS[type]].add(item)

    } else {
      Database.bookmarks.remove(id, type).then(() => {
        dispatch({
          type   : Constants.REMOVE_BOOKMARK,
          payload: id,
        })
      })

      // Remove from database
      Database[MetadataConstants.PLURALS[type]].remove(id)
    }
  }
}
