// @flow
import * as Constants from './WatchedConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCHED_MOVIES_WATCHED:
      return {
        ...state,
        moviesWatched: action.payload,
      }

    case Constants.REMOVE_MOVIE_WATCHED:
      return {
        ...state,
        moviesWatched: state.moviesWatched.filter(movies => movies !== action.payload),
      }

    default:
      return state

  }
}
