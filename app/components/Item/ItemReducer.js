// @flow
import { WatchedConstants } from 'components/Watched'
import * as ItemConstants from './ItemConstants'

export default (state = ItemConstants.INITIAL_STATE, action) => {
  switch (action.type) {

    case ItemConstants.FETCH_ITEM:
      return {
        ...state,
        isLoading: true,
      }

    case ItemConstants.FETCHED_ITEM:
      return {
        ...state,
        isLoading: false,
        item     : action.payload,
      }

    case ItemConstants.FETCH_EPISODE_TORRENTS:
      return {
        ...state,
        fetchingEpisodeTorrents: true,
      }

    case ItemConstants.FETCHED_EPISODE_TORRENTS:
      return {
        ...state,
        fetchingEpisodeTorrents: false,
        item                   : action.payload,
      }

    case WatchedConstants.MARKED_EPISODE:
      return {
        ...state,
        item: {
          ...state.item,
          seasons: state.item.seasons.map((season) => {
            if (season.number === action.payload.season) {
              const episodes = season.episodes.map((episode) => {
                if (episode.number === action.payload.episode) {
                  return {
                    ...episode,
                    watched: action.payload.watched,
                  }
                }
                return episode

              })

              return {
                ...season,
                episodes,
                watched: (episodes.filter(episode => !!episode.watched).length / episodes.length) * 100,
              }
            }

            return season
          }),
        },
      }

    default:
      return state

  }
}
