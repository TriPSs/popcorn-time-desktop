// @flow
import * as BookmarkedConstants from 'components/Bookmarked/BookmarkedConstants'
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
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          [action.payload.mode]: {
            page : state.modes[action.payload.mode].page + 1,
            limit: state.modes[action.payload.mode].limit,
            items: [...state.modes[action.payload.mode].items, ...action.payload.items],
          },
        },
      }

    case HomeConstants.CLEAR_ITEMS:
      return {
        ...state,
        modes: {
          ...state.modes,
          [action.payload]: HomeConstants.INITIAL_STATE.modes[action.payload],
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
