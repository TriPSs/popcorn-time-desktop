// @flow
import * as Constants from './HomeConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCH_ITEMS:
      return {
        ...state,
        isLoading: true,
      }

    case Constants.FETCHED_ITEMS:
      return {
        ...state,
        isLoading: false,
        items    : [...state.modes[state.activeMode].items, ...action.payload.items],
        modes    : {
          ...state.modes,
          [state.activeMode]: {
            page : state.modes[state.activeMode].page + 1,
            limit: state.modes[state.activeMode].limit,
            items: [...state.modes[state.activeMode].items, ...action.payload.items],
          },
        },
      }

    case Constants.CLEAR_ITEMS:
      return {
        ...state,
        items: [],
      }

    case Constants.SET_ACTIVE_MODE:
      return {
        ...state,
        ...action.payload,
        isLoading: true,
      }

    default:
      return state
  }
}

/*

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
 */
