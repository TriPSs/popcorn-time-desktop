// @flow
import type { contentType } from 'api/metadata/MetadataProviderInterface'

import * as Constants from './HomeConstants'

type modeType = 'movies' | 'shows' | 'search';

type actionType = {
  type: string,
  items?: Array<contentType>,
  activeMode?: modeType,
  activeModeOptions?: {
    [option: string]: string | boolean | number
  },
  infinitePagination?: boolean,
  isLoading?: boolean
};

export default (state = Constants.INITIAL_STATE, action: actionType) => {
  switch (action.type) {

    case Constants.PAGINATE:
      return {
        ...state,

        items: [...state.modes[state.activeMode].items, ...action.items],
        modes: {
          ...state.modes,
          [state.activeMode]: {
            items: [...state.modes[state.activeMode].items, ...action.items],
            page : state.modes[state.activeMode].page + 1,
            limit: 50,
          },
        },
      }

    case Constants.SET_ACTIVE_MODE:
      return {
        ...state,
        items            : state.modes[action.activeMode].items,
        activeMode       : action.activeMode,
        activeModeOptions: action.activeModeOptions,
      }

    case Constants.CLEAR_ITEMS:
      return {
        ...state,
        items: [],
      }

    case Constants.CLEAR_ALL_ITEMS:
      return {
        ...state,
        items: [],
        modes: {
          ...state.modes,
          [state.activeMode]: {
            items: [],
            page : 0,
            limit: 50,
          },
        },
      }

    case Constants.SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }

    default:
      return state
  }
}
