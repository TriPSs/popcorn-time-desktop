// @flow
import rbg from 'torrentapi-wrapper'
import debug from 'debug'

import * as Helpers from 'api/Torrents/TorrentHelpers'
import type { ShowType } from 'api/Metadata/MetadataTypes'
import type { TorrentProviderInterface } from '../TorrentProviderInterface'
import type { TorrentType } from '../TorrentsTypes'

const log = debug('api:torrents:providers:rarbg')

export default class RarbgTorrentProvider implements TorrentProviderInterface {

  static providerName = 'rbg'

  searchEpisode = (item: ShowType, season: string, episode: string, retry: boolean = false) =>
    new Promise((resolve, reject) => {
      log('Searching...')

      rbg.search({
        query   : Helpers.formatShowToSearchQuery(item.title, season, episode),
        category: 'TV',
        sort    : 'seeders',
        verified: false,
      }).then((results) => {
        const bestTorrents = {}
        results.filter(torrent => torrent.episode_info.imdb === item.id)
               .map(torrent => this.formatTorrent(torrent, Helpers.determineQuality(torrent.download)))
               .forEach((torrent: TorrentType) => {
                 if (!bestTorrents[torrent.quality] || Helpers.betBestTorrent(bestTorrents[torrent.quality], torrent)) {
                   bestTorrents[torrent.quality] = torrent
                 }
               })

        resolve(bestTorrents)

      }).catch(() => {
        if (!retry) {
          return resolve(this.searchEpisode(item, season, episode, true))

        } else {
          return reject()
        }
      })
    })

  search = (query: string, category: string, retry: boolean = false) =>
    new Promise((resolve, reject) => {
      log(`Search ${query} in ${category}`)
      rbg.search({
        query,
        category,
        sort    : 'seeders',
        verified: false,
      }).then((results) => results.map(torrent => this.formatTorrent(torrent)))
         .catch(() => {
           if (!retry) {
             return resolve(this.search(query, category, true))

           } else {
             return reject()
           }
         })
    })

  formatTorrent = (torrent, quality) => ({
    url     : torrent.download,
    seeds   : torrent.seeders,
    peers   : torrent.leechers,
    size    : torrent.size,
    filesize: torrent.size,
    provider: RarbgTorrentProvider.providerName,
    health  : Helpers.getHealth(torrent.seeders, torrent.leechers),
    quality,
  })
}
