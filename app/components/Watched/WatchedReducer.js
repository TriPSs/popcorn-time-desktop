// @flow
import * as WatchedConstants from './WatchedConstants'

export default (state = WatchedConstants.INITIAL_STATE, action) => {
  switch (action.type) {

    case WatchedConstants.FETCHED_MOVIES_WATCHED:
      return {
        ...state,
        moviesWatched: action.payload,
      }

    case WatchedConstants.MARKED_MOVIE:
      return {
        ...state,
        moviesWatched: [...state.moviesWatched, action.payload],
      }

    case WatchedConstants.REMOVE_MOVIE_WATCHED:
      return {
        ...state,
        moviesWatched: state.moviesWatched.filter(movie => movie !== action.payload),
      }

    default:
      return state

  }
}
