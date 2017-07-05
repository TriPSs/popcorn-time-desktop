export const REDUCER_NAME = 'home'

export const INITIAL_STATE = {
  activeMode        : 'movies',
  activeModeOptions : {},
  modes             : {
    movies: { page: 1, limit: 50, items: [] },
    shows : { page: 1, limit: 50, items: [] },
    search: { page: 1, limit: 50, items: [] },
  },
  infinitePagination: false,
  isLoading         : false,
  items             : [],
}

export const PAGINATE           = `${REDUCER_NAME}.paginate`
export const SET_ACTIVE_MODE    = `${REDUCER_NAME}.set.active.mode`
export const CLEAR_ITEMS        = `${REDUCER_NAME}.clear.items`
export const CLEAR_ALL_ITEMS    = `${REDUCER_NAME}.clear.items.all`
export const SET_LOADING        = `${REDUCER_NAME}.set.loading`
export const SET_CURRENT_PLAYER = `${REDUCER_NAME}.set.current.player`
