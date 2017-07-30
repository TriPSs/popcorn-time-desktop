// @flow
import Trakt from 'trakt.tv'
import hasOwnProperty from 'has-own-property'

import * as MetadataConstant from 'api/Metadata/MetadataConstants'
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

  getSeasons(itemId: string, pctSeasons, watchedEpisodes) {
    return this.trakt.seasons
               .summary({ id: itemId, extended: 'episodes,full' })
               .then(response => response.filter(season => season.aired_episodes !== 0))
               .then(seasons => this.formatSeasons(seasons, pctSeasons, itemId, watchedEpisodes))
  }

  formatSeasons = (seasons, pctSeasons, itemId, watchedEpisodes) => seasons.map(season => ({
    showId  : itemId,
    title   : season.title,
    summary : season.overview,
    number  : season.number,
    episodes: this.formatEpisodes(season.episodes, pctSeasons[season.number], itemId, watchedEpisodes),
    type    : MetadataConstant.TYPE_SHOW_SEASON,
    watched : this.getSeasonWatchedPercentage(season, watchedEpisodes),
  }))

  formatEpisodes = (episodes, pctSeason, itemId, watchedEpisodes) => episodes.map((episode: EpisodeType) => ({
    id      : episode.ids.imdb,
    showId  : itemId,
    title   : episode.title,
    summary : episode.overview,
    number  : episode.number,
    season  : episode.season,
    type    : MetadataConstant.TYPE_SHOW_EPISODE,
    aired   : new Date(episode.first_aired).getTime(),
    torrents: this.getEpisodeTorrents(episode, pctSeason),
    watched : this.isEpisodeWatched(episode, watchedEpisodes),
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

  getSeasonWatchedPercentage = (season, watchedEpisodes) => {
    const watched = watchedEpisodes.filter(episode => episode.season === season.number)

    return (watched.length / season.episodes.length) * 100
  }

  isEpisodeWatched = (episode, watchedEpisodes) => !!watchedEpisodes.find(watchedEpisode =>
    watchedEpisode.episode === episode.number
    && watchedEpisode.season === episode.season,
  )

}
