import Database from 'api/Database'

import type { MovieType, EpisodeType } from 'api/Metadata/MetadataTypes'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as WatchedConstants from './WatchedConstants'
import { selectSeasonAndEpisode } from '../Item/ItemActions'

export const getMoviesWatched = () => (dispatch) => {
  Database.watched.getMoviesWatched().then((movies) => {
    dispatch({
      type   : WatchedConstants.FETCHED_MOVIES_WATCHED,
      payload: movies,
    })
  })
}

export const markedMovie = itemId => ({
  type   : WatchedConstants.MARKED_MOVIE,
  payload: itemId,
})

export const removeMarkedMovie = itemId => ({
  type   : WatchedConstants.REMOVE_MOVIE_WATCHED,
  payload: itemId,
})

export const markedEpisode = (itemId, season, episode, watched) => ({
  type   : WatchedConstants.MARKED_EPISODE,
  payload: {
    itemId,
    season,
    episode,
    watched,
  },
})

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
      Database.watched.markEpisodeWatched(item.showId, item.season, item.number, 100).then(() => {
        dispatch(markedEpisode(item.showId, item.season, item.number, { complete: true, progress: 100 }))

        dispatch(selectSeasonAndEpisode(null, null))
      })
    }
  }
}

export const updatePercentage = (item: MovieType | EpisodeType, percentage: number) => (dispatch) => {
  if (item.type === MetadataConstants.TYPE_MOVIE) {
    dispatch({
      type   : WatchedConstants.UPDATE_PERCENTAGE_MOVIE,
      payload: {
        watched: {
          complete: percentage > 95,
          progress: percentage,
        },
      },
    })

    if (percentage > 95) {
      dispatch(markedMovie(item.id))
    }

  } else {
    Database.watched.updateEpisodePercentage(item.showId, item.season, item.number, percentage).then(() => {
      dispatch({
        type   : WatchedConstants.UPDATE_PERCENTAGE_EPISODE,
        payload: {
          season : item.season,
          episode: item.number,
          watched: {
            complete: percentage > 95,
            progress: percentage,
          },
        },
      })
    })
  }
}
