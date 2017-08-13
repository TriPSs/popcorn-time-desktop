import Database from 'api/Database'

import type { MovieType, EpisodeType } from 'api/Metadata/MetadataTypes'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as WatchedConstants from './WatchedConstants'
import { selectSeasonAndEpisode } from '../Item/ItemActions'

export const markedMovie = (itemId, watched) => ({
  type   : WatchedConstants.MARKED_MOVIE,
  payload: {
    itemId,
    watched,
  },
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
        dispatch(markedMovie(item.id, { complete: false, progress: 0 }))
      })

    } else {
      Database.watched.markMovieWatched(item.id, 100).then(() => {
        dispatch(markedMovie(item.id, { complete: true, progress: 100 }))
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
    Database.watched.updateMoviePercentage(item.id, percentage).then(() => {
      dispatch({
        type   : WatchedConstants.UPDATE_PERCENTAGE_MOVIE,
        payload: {
          watched: {
            complete: percentage > 95,
            progress: percentage,
          },
        },
      })
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
