// @flow
import Trakt from 'trakt.tv'
import hasOwnProperty from 'has-own-property'

import type { EpisodeType } from './TraktMetadataTypes'
import type { MetadataProviderInterface } from '../MetadataProviderInterface'

export default class TraktMetadataAdapter implements MetadataProviderInterface {

  clientId     = '647c69e4ed1ad13393bf6edd9d8f9fb6fe9faf405b44320a6b71ab960b4540a2'
  clientSecret = 'f55b0a53c63af683588b47f6de94226b7572a6f83f40bd44c58a7c83fe1f2cb1'

  trakt: Trakt

  constructor() {
    this.trakt = new Trakt({
      client_id    : this.clientId,
      client_secret: this.clientSecret,
    })
  }

  getSeasons(itemId: string, pctSeasons) {
    return this.trakt.seasons
               .summary({ id: itemId, extended: 'episodes,full' })
               .then(response => response.filter(season => season.aired_episodes !== 0))
               .then(seasons => this.formatSeasons(seasons, pctSeasons))
  }

  formatSeasons = (seasons, pctSeasons) => seasons.map(season => ({
    title   : season.title,
    summary : season.overview,
    number  : season.number,
    episodes: this.formatEpisodes(season.episodes, pctSeasons[season.number]),
  }))

  formatEpisodes = (episodes, pctSeason) => episodes.map((episode: EpisodeType) => ({
    id      : episode.ids.imdb,
    title   : episode.title,
    summary : episode.overview,
    number  : episode.number,
    aired   : new Date(episode.first_aired).getTime(),
    torrents: this.getEpisodeTorrents(episode, pctSeason),
  }))

  getEpisodeTorrents = (episode, pctSeason) => {
    if (!pctSeason || !hasOwnProperty(pctSeason, episode.number)) {
      return {
        '1080p': null,
        '720p' : null,
        '480p' : null,
      }
    }

    return pctSeason[episode.number].torrents
  }
}
