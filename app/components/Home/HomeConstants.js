export const REDUCER_NAME = 'home'

export const MODE_MOVIES    = 'movies'
export const MODE_SHOWS     = 'shows'
export const MODE_SEARCH    = 'search'
export const MODE_FAVORITES = 'favorites'

export const INITIAL_STATE = {
  activeMode       : MODE_MOVIES,
  activeModeOptions: {},
  modes            : {
    favorites: { page: 1, limit: 50, items: [] },
    movies   : { page: 1, limit: 50, items: [] },
    shows    : { page: 1, limit: 50, items: [] },
    search   : { page: 1, limit: 50, items: [] },
  },
  isLoading        : false,
  items            : [],
}

export const FETCH_ITEMS     = `${REDUCER_NAME}.fetch.items`
export const FETCHED_ITEMS   = `${REDUCER_NAME}.fetched.items`
export const CLEAR_ITEMS     = `${REDUCER_NAME}.clear.items`
export const SET_ACTIVE_MODE = `${REDUCER_NAME}.set.active.mode`
