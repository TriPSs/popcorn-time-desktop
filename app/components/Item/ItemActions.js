// @flow
import Butter from 'api/Butter'
import { getBestTorrent } from 'api/Torrents/TorrentsHelpers'

import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as Constants from './ItemConstants'
import * as HomeSelectors from '../Home/HomeSelectors'

export function hasItem(itemId, mode, state) {
  const pluralMode = MetadataConstants.PLURALS[mode]
  return HomeSelectors.getModes(state)[pluralMode].items.find(item => item.id === itemId)
}

export function fetchItem() {
  return {
    type: Constants.FETCH_ITEM,
  }
}

export function fetchedItem(item) {
  return {
    type   : Constants.FETCHED_ITEM,
    payload: item,
  }
}

export function fetchEpisodeTorrents() {
  return {
    type: Constants.FETCH_EPISODE_TORRENTS,
  }
}

export function fetchedEpisodeTorrents(item) {
  return {
    type   : Constants.FETCHED_EPISODE_TORRENTS,
    payload: item,
  }
}

export function getItem(itemId, mode) {
  return (dispatch, getState) => {
    dispatch(fetchItem())

    if (mode === MetadataConstants.TYPE_MOVIE) {
      const item = hasItem(itemId, mode, getState())
      if (item) {
        return dispatch(fetchedItem(item))
      }

      return Butter.getMovie(itemId).then(movie => dispatch(fetchedItem(movie)))

    } else if (mode === MetadataConstants.TYPE_SHOW) {
      return Butter.getShow(itemId).then(show => dispatch(fetchedItem(show)))
    }
  }
}

export function searchEpisodeTorrents(item, inSeason, forEpisode) {
  return (dispatch) => {
    dispatch(fetchEpisodeTorrents())

    Butter.searchEpisode(item, inSeason, forEpisode).then((response) => {
      const bestTorrents = {}

      response.forEach((torrents) => Object.keys(torrents).forEach((quality) => {
        const torrent = torrents[quality]
        if (!bestTorrents[torrent.quality] || getBestTorrent(bestTorrents[torrent.quality], torrent)) {
          bestTorrents[torrent.quality] = torrent
        }
      }))

      /**
       * Map the torrents to the right episode
       */
      const nItem = {
        ...item,
        seasons: item.seasons.map((season) => {
          if (season.number === inSeason) {
            return {
              ...season,
              episodes: season.episodes.map((episode) => {
                if (episode.number === forEpisode) {
                  return {
                    ...episode,
                    torrents: {
                      ...episode.torrents,
                      ...bestTorrents,
                    },
                    searched: true,
                  }

                } else {
                  return episode
                }
              }),
            }

          } else {
            return season
          }
        }),
      }

      dispatch(fetchedEpisodeTorrents(nItem))
    })
  }
}
