// @flow
import * as BookmarkedConstants from 'components/Bookmarked/BookmarkedConstants'
import * as ItemConstants from 'components/Item/ItemConstants'
import { WatchedConstants } from 'components/Watched'
import * as HomeConstants from './HomeConstants'

export default (state = HomeConstants.INITIAL_STATE, action) => {
  switch (action.type) {

    case HomeConstants.FETCH_ITEMS:
      return {
        ...state,
        isLoading: true,
      }

    case HomeConstants.FETCHED_ITEMS:
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
        modes: {
          ...state.modes,
          [HomeConstants.MODE_BOOKMARKS]: {
            ...state.modes[HomeConstants.MODE_BOOKMARKS],
            items: state.modes[HomeConstants.MODE_BOOKMARKS].items.filter(item => item.id !== action.payload),
          },
        },
      }

    case BookmarkedConstants.ADD_BOOKMARK:
      return {
        ...state,
        modes: {
          ...state.modes,
          [HomeConstants.MODE_BOOKMARKS]: {
            ...state.modes[HomeConstants.MODE_BOOKMARKS],
            items: [
              ...state.modes[HomeConstants.MODE_BOOKMARKS].items,
              action.payload.item,
            ],
          },
        },
      }

    case WatchedConstants.MARKED_MOVIE:
      return {
        ...state,
        modes: {
          ...state.modes,
          [HomeConstants.MODE_BOOKMARKS]: {
            ...state.modes[HomeConstants.MODE_BOOKMARKS],
            items: state.modes[HomeConstants.MODE_BOOKMARKS].items.map((item) => {
              if (item.id === action.payload.itemId) {
                return {
                  ...item,
                  watched: action.payload.watched,
                }
              }

              return item
            }),
          },
        },
      }

    default:
      return state
  }
}
