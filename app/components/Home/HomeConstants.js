export const REDUCER_NAME = 'home'

export const INITIAL_STATE = {
  activeMode       : 'movies',
  activeModeOptions: {},
  modes            : {
    movies: { page: 1, limit: 50, items: [] },
    shows : { page: 1, limit: 50, items: [] },
    search: { page: 1, limit: 50, items: [] },
  },
  isLoading        : false,
  items            : [],
}

export const FETCH_ITEMS   = `${REDUCER_NAME}.fetch.items`
export const FETCHED_ITEMS = `${REDUCER_NAME}.fetched.items`

export const SET_ACTIVE_MODE = `${REDUCER_NAME}.set.active.mode`

export const CLEAR_ITEMS        = `${REDUCER_NAME}.clear.items`
export const SET_CURRENT_PLAYER = `${REDUCER_NAME}.set.current.player`
