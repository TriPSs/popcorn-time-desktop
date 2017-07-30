import Database from 'api/Database'

import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as WatchedConstants from './WatchedConstants'

export const getMoviesWatched = () => (dispatch) => {
  Database.watched.getMoviesWatched().then((movies) => {
    dispatch({
      type   : WatchedConstants.FETCHED_MOVIES_WATCHED,
      payload: movies,
    })
  })
}

export function markedMovie(itemId) {
  return {
    type   : WatchedConstants.MARKED_MOVIE,
    payload: itemId,
  }
}

export function removeMarkedMovie(itemId) {
  return {
    type   : WatchedConstants.REMOVE_MOVIE_WATCHED,
    payload: itemId,
  }
}

export function markedEpisode(itemId, season, episode, watched) {
  return {
    type   : WatchedConstants.MARKED_EPISODE,
    payload: {
      itemId,
      season,
      episode,
      watched,
    },
  }
}

export const toggleWatched = item => (dispatch) => {
  if (item.type === MetadataConstants.TYPE_MOVIE) {
    if (item.watched) {
      Database.watched.markMovieUnWatched(item.id).then(() => {
        dispatch(removeMarkedMovie(item.id))
      })

    } else {
      Database.watched.markMovieWatched(item.id).then(() => {
        dispatch(markedMovie(item.id))
      })
    }

  } else if (item.type === MetadataConstants.TYPE_SHOW_EPISODE) {
    if (item.watched) {
      Database.watched.markEpisodeNotWatched(item.showId, item.season, item.number).then(() => {
        dispatch(markedEpisode(item.showId, item.season, item.number, false))
      })

    } else {
      Database.watched.markEpisodeWatched(item.showId, item.season, item.number).then(() => {
        dispatch(markedEpisode(item.showId, item.season, item.number, true))
      })
    }
  }
}

