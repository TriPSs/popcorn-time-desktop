// @flow
import Butter from 'api/Butter'
import { getBestTorrent } from 'api/Torrents/TorrentHelpers'

import * as Constants from './ItemConstants'

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

export function getItem(itemId, activeMode) {
  return (dispatch) => {
    dispatch(fetchItem())

    switch (activeMode) {
      case 'movie':
        return Butter.getMovie(itemId).then(movie => dispatch(fetchedItem(movie)))

      case 'show':
        return Butter.getShow(itemId).then(show => dispatch(fetchedItem(show)))

      default:
        return null
    }
  }
}

export function searchEpisodeTorrents(item, season, episode) {
  return (dispatch, getState) => {
    dispatch(fetchEpisodeTorrents())

    Butter.searchEpisode(item, season, episode).then((response) => {
      const bestTorrents = {}

      response.forEach((torrents) => Object.keys(torrents).forEach((quality) => {
        const torrent = torrents[quality]
        if (!bestTorrents[torrent.quality] || getBestTorrent(bestTorrents[torrent.quality], torrent)) {
          bestTorrents[torrent.quality] = torrent
        }
      }))

      // TODO:: Update the episode with the torrents
      // dispatch(fetchedEpisodeTorrents(bestTorrents))
    })
  }
}
