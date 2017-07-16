// @flow
import * as Constants from './ItemConstants'

export default (state = Constants.INITIAL_STATE, action) => {
  switch (action.type) {

    case Constants.FETCH_ITEM:
      return {
        ...state,
        isLoading: true,
      }

    case Constants.FETCHED_ITEM:
      return {
        ...state,
        isLoading: false,
        item     : action.payload,
      }

    case Constants.FETCH_EPISODE_TORRENTS:
      return {
        ...state,
        fetchingEpisodeTorrents: true,
      }

    case Constants.FETCHED_EPISODE_TORRENTS:
      return {
        ...state,
        fetchingEpisodeTorrents: false,
        item                   : action.payload,
      }

    case Constants.MARKED_MOVIE_WATCHED:
      return {
        ...state,
        item: {
          ...state.item,
          watched: true
        },
      }

    case Constants.MARKED_EPISODE_UNWATCHED:
    case Constants.MARKED_EPISODE_WATCHED:
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
                } else {
                  return episode
                }
              })
              return {
                ...season,
                episodes,
                watched: (episodes.filter(episode => !!episode.watched).length / episodes.length) * 100,
              }
            } else {
              return season
            }
          }),
        },
      }

    default:
      return state

  }
}
