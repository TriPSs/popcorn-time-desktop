import Database from 'api/Database'

import * as Constants from './WatchedConstants'

export function getMoviesWatched() {
  return (dispatch) => {
    Database.watched.getMoviesWatched().then((movies) => {
      dispatch({
        type   : Constants.FETCHED_MOVIES_WATCHED,
        payload: movies,
      })
    })
  }
}
