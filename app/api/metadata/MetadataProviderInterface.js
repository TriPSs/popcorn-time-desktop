// @flow
import type { MovieType, ShowType } from './MetadataTypes'

export interface MetadataProviderInterface {

  getMovies: (page: number, limit: number, options: optionsType) => Promise<MovieType>,

  getMovie: (itemId: string) => MovieType,

  getShows: (page: number, limit: number) => Promise<ShowType>,

  getShow: (itemId: string) => ShowType,

  // provide: (itemId: string, type: string) => Promise<Array<torrentType>>,

  getStatus: () => Promise<boolean>,

  // getSimilar: (type: string, itemId: string, limit: number) => Promise<Array<contentType>>,

  // supportedIdTypes: Array<'tmdb' | 'imdb'>,

  // getSeasons: (itemId: string) => Promise<Array<seasonType>>,

  // getSeason: (itemId: string, season: number) => Promise<episodeType>,

  // getEpisode: (itemId: string, season: number, episode: number) => episodeType,

  // search: (query: string, page: number) => Promise<Array<contentType>>,

  // updateConfig: (type: string, method: string, metadata: contentType) => void,

  // favorites: () => void,

  // recentlyWatched: () => void,

  // watchList: () => void

}
