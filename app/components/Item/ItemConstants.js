export const REDUCER_NAME = 'item'

export const INITIAL_STATE = {
  fetchingEpisodeTorrents: false,
  isLoading              : false,
  item                   : null,
  playerStatus           : null,
}

export const FETCH_ITEM   = `${REDUCER_NAME}.fetch.item`
export const FETCHED_ITEM = `${REDUCER_NAME}.fetched.item`

export const FETCH_EPISODE_TORRENTS   = `${REDUCER_NAME}.fetch.episode.torrents`
export const FETCHED_EPISODE_TORRENTS = `${REDUCER_NAME}.fetched.episode.torrents`

export const MARKED_MOVIE_WATCHED   = `${REDUCER_NAME}.watched.movie`
export const MARKED_MOVIE_UNWATCHED = `${REDUCER_NAME}.unwatched.movie`

export const MARKED_EPISODE_WATCHED   = `${REDUCER_NAME}.watched.show`
export const MARKED_EPISODE_UNWATCHED = `${REDUCER_NAME}.unwatched.show`
