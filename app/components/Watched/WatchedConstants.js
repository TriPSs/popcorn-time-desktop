export const REDUCER_NAME = 'watched'

export const INITIAL_STATE = {
  moviesWatched: [],
}

export const FETCHED_MOVIES_WATCHED = `${REDUCER_NAME}.movies`
export const REMOVE_MOVIE_WATCHED   = `${REDUCER_NAME}.remove.movie`

export const MARKED_MOVIE   = `${REDUCER_NAME}.watched.movie`
export const MARKED_EPISODE = `${REDUCER_NAME}.watched.show`
