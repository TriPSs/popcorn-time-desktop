// @flow
import rbg from 'torrentapi-wrapper'
import debug from 'debug'

import * as Helpers from 'api/Torrents/TorrentsHelpers'
import type { ShowType } from 'api/Metadata/MetadataTypes'
import type { TorrentProviderInterface } from '../TorrentsProviderInterface'
import type { TorrentType } from '../TorrentsTypes'

const log = debug('api:torrents:providers:rarbg')

export default class RarbgTorrentProvider implements TorrentProviderInterface {

  static providerName = 'rbg'

  searchEpisode = (item: ShowType, season: string, episode: string, retry: boolean = false) =>
    new Promise((resolve) => {
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
            if (!bestTorrents[torrent.quality] || Helpers.getBestTorrent(bestTorrents[torrent.quality], torrent)) {
              bestTorrents[torrent.quality] = torrent
            }
          })

        resolve(bestTorrents)

      }).catch((error) => {
        log(`Failed search ${error}`)

        if (!retry) {
          return resolve(this.searchEpisode(item, season, episode, true))
        }

        return resolve([])
      })
    })

  search = (query: string, category: string, retry: boolean = false) =>
    new Promise((resolve) => {
      log(`Search ${query} in ${category}`)
      rbg.search({
        query,
        category,
        sort    : 'seeders',
        verified: false,
      }).then(results => results.map(torrent => this.formatTorrent(torrent)))
        .catch((error) => {
          log(`Failed search ${error}`)

          if (!retry) {
            return resolve(this.search(query, category, true))
          }

          return resolve([])
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
