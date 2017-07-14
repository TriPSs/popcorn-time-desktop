/**
 * The highest level abstraction layer for querying torrents and metadata
 * @flow
 */
import MetadataAdapter from './Metadata/TraktMetadataProvider'
import PctTorrentProvider from './Torrents/PctTorrentProvider'
import TorrentAdapter from './Torrents'

export class Butter {

  metadataAdapter: MetadataAdapter

  pctAdapter: PctTorrentProvider

  torrentAdapter: TorrentAdapter

  constructor() {
    this.pctAdapter      = new PctTorrentProvider()
    this.metadataAdapter = new MetadataAdapter()
    this.torrentAdapter  = new TorrentAdapter()
  }

  getMovies = (page: number = 1, filters = {}) => this.pctAdapter.getMovies(page, filters)

  getMovie = (itemId: string) => this.pctAdapter.getMovie(itemId)

  getShows = (page: number = 1, filters = {}) => this.pctAdapter.getShows(page, filters)

  getShow = (itemId: string) => this.pctAdapter.getShow(itemId)
                                    .then(pctShow => this.metadataAdapter
                                                         .getSeasons(pctShow.id, pctShow.seasons)
                                                         .then(seasons => ({
                                                           ...pctShow,
                                                           seasons,
                                                         })))

  searchEpisode = (...args) => this.torrentAdapter.searchEpisode(...args)

  search = (...args) => this.torrentAdapter.search(...args)

}

export const instance = new Butter()

export default instance
