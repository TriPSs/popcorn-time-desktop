// @flow
import * as BookmarkedConstants from 'components/Bookmarked/BookmarkedConstants'
import * as Constants from './HomeConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCH_ITEMS:
      return {
        ...state,
        isLoading: true,
      }

    case Constants.FETCHED_ITEMS:
      const { items, mode } = action.payload

      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          [mode]: {
            page : state.modes[mode].page + 1,
            limit: state.modes[mode].limit,
            items: [...state.modes[mode].items, ...items],
          },
        },
      }

    case BookmarkedConstants.REMOVE_BOOKMARK:
      return {
        ...state,
        modes    : {
          ...state.modes,
          [Constants.MODE_BOOKMARKS]: {
            ...state.modes[Constants.MODE_BOOKMARKS],
            items: state.modes[Constants.MODE_BOOKMARKS].items.filter(item => item.id !== action.payload),
          },
        },
      }

    case BookmarkedConstants.ADD_BOOKMARK:
      return {
        ...state,
        modes    : {
          ...state.modes,
          [Constants.MODE_BOOKMARKS]: {
            ...state.modes[Constants.MODE_BOOKMARKS],
            items: [
              ...state.modes[Constants.MODE_BOOKMARKS].items,
              action.payload.item,
            ],
          },
        },
      }

    default:
      return state
  }
}
