export const REDUCER_NAME = 'item'

export const INITIAL_STATE = {
  isLoading: false,
  item     : null,
}

export const FETCH_ITEM   = `${REDUCER_NAME}.fetch.item`
export const FETCHED_ITEM = `${REDUCER_NAME}.fetched.item`
