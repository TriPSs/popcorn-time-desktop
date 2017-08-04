// @flow
import MetadataAdapter from './Metadata'
import PctTorrentProvider from './Torrents/PctTorrentProvider'
import TorrentAdapter from './Torrents'

export default new (class {

  metadataAdapter: MetadataAdapter

  pctAdapter: PctTorrentProvider

  torrentAdapter: TorrentAdapter

  constructor() {
    this.pctAdapter      = new PctTorrentProvider()
    this.torrentAdapter  = new TorrentAdapter()
    this.metadataAdapter = new MetadataAdapter()
  }

  getMovies = (page: number = 1, filters: Object = {}) => (
    this.pctAdapter.getMovies(page, filters)
  )

  getMovie = (itemId: string) => (
    this.pctAdapter.getMovie(itemId)
  )

  getShows = (page: number = 1, filters: Object = {}) => (
    this.pctAdapter.getShows(page, filters)
  )

  getShow = (itemId: string) => (
    this.pctAdapter
      .getShow(itemId)
      .then(pctShow => (
        this.metadataAdapter
          .getSeasons(itemId, pctShow.seasons)
          .then(seasons => ({
            ...pctShow,
            seasons,
          }))),
      )
  )

  searchEpisode = (...args) => (
    this.torrentAdapter.searchEpisode(...args)
  )

  search = (...args) => (
    this.torrentAdapter.search(...args)
  )

})()
