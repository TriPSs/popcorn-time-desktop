// @flow

export type EpisodeType = {
  available_translations: Array,
  first_aired: string,
  ids: {
    imbdb: string,
    tmdb: number,
    trakt: number,
    tvdb: number,
    tvrage: number,
  },
  number: number,
  number_abs: number,
  overview: string,
  rating: number,
  runtime: number,
  season: number,
  title: string,
  updated_at: string,
  votes: number,
}
