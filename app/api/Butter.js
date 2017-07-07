/**
 * The highest level abstraction layer for querying torrents and metadata
 * @flow
 */
import TorrentAdapter from './torrents/TorrentAdapter'
import MetadataAdapter from './metadata/MetadataAdapter'
import PctMetadataProvider from './metadata/PctMetadataProvider'

export class Butter {

  metadata: MetadataAdapter

  pctAdapter: PctMetadataProvider

  constructor() {
    this.metadata   = MetadataAdapter
    this.pctAdapter = new PctMetadataProvider()
  }

  getMovies = (page: number = 1, limit: number = 50) => this.pctAdapter.getMovies(page, limit)

  getMovie = (itemId: string) => this.pctAdapter.getMovie(itemId)

  getShows = (page: number = 1, limit: number = 50) => this.pctAdapter.getShows(page, limit)

  getShow = (itemId: string) => this.pctAdapter.getShow(itemId)

  searchTorrent = (itemId: string, type: string) => {
    return TorrentAdapter(itemId, type, {}, false)
  }

  /* getSeasons(itemId: string) {
   return MetadataAdapter.getSeasons(itemId);
   }

   getSeason(itemId: string, season: number) {
   return MetadataAdapter.getSeason(itemId, season);
   }

   getEpisode(itemId: string, season: number, episode: number) {
   return MetadataAdapter.getEpisode(itemId, season, episode);
   }

   getSimilar(type: string = 'movies', itemId: string) {
   return MetadataAdapter.getSimilar(type, itemId, 5);
   }*/

  /**
   * @param {string}  itemId
   * @param {string}  type            | Type of torrent: movie or show
   * @param {object}  extendedDetails | Additional details provided for heuristics
   * @param {boolean} returnAll
   */
  getTorrent(itemId: string, type: string, extendedDetails: { [option: string]: string | number } = {}, returnAll: boolean = false) {
    return TorrentAdapter(itemId, type, extendedDetails, returnAll)
  }

  /*  getSubtitles(itemId: string, filename: string, length: number, metadata: Object) {
   return MetadataAdapter.getSubtitles(itemId, filename, length, metadata);
   }*/

  /*  favorites(method: string, metadata: Object) {
   return MetadataAdapter.favorites(method, metadata);
   }

   recentlyWatched(method: string, metadata: Object) {
   return MetadataAdapter.recentlyWatched(method, metadata);
   }

   watchList(method: string, metadata: Object) {
   return MetadataAdapter.watchList(method, metadata);
   }*/

}

export const instance = new Butter()

export default instance
