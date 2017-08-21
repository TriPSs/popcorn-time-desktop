// @flow
import axios from 'axios'
import hasOwnProperty from 'has-own-property'

import * as MetadataConstant from 'api/Metadata/MetadataConstants'
import type { EpisodeType } from './TmdbMetadataTypes'
import type { MetadataProviderInterface } from '../MetadataProviderInterface'

export default class TmdbMetadataProvider implements MetadataProviderInterface {

  key = '809858c82322872e2be9b2c127ccdcf7'

  imageUri = 'https://image.tmdb.org/t/p/'

  apiUri = 'https://api.themoviedb.org/3/'

  tmdb: axios

  constructor() {
    this.tmdb = axios.create({
      baseURL: this.apiUri,
      params : {
        api_key: this.key,
      },
    })
  }

  getSeasons = (itemId, tmdbId: string, pctSeasons, watchedEpisodes) =>
    this.tmdb.get(`tv/${tmdbId}`)
      .then(({ data }) => this.formatSeasons(data.seasons, pctSeasons, itemId, tmdbId, watchedEpisodes))

  formatSeasons = (seasons, pctSeasons, itemId, tmdbId, watchedEpisodes) => Promise.all(
    seasons.map(season =>
      this.getSeasonAndEpisodes(
        season.season_number,
        tmdbId,
        pctSeasons[season.season_number],
        itemId,
        watchedEpisodes,
      ),
    ),
  )

  getSeasonAndEpisodes = (seasonNr, tmdbId, pctSeason, itemId, watchedEpisodes) => (
    this.tmdb.get(`tv/${tmdbId}/season/${seasonNr}`).then(({ data }) => ({
      title   : data.name,
      summary : data.overview,
      episodes: this.formatEpisodes(data.episodes, pctSeason, itemId, watchedEpisodes),
      showId  : itemId,
      number  : data.season_number,
      type    : MetadataConstant.TYPE_SHOW_SEASON,
      images  : this.formatImage(data.poster_path),
    }))
  )

  formatEpisodes = (episodes, pctSeason, itemId, watchedEpisodes) => episodes.map((episode: EpisodeType) => ({
    id      : episode.id,
    showId  : itemId,
    title   : episode.name,
    summary : episode.overview,
    number  : episode.episode_number,
    season  : episode.season_number,
    type    : MetadataConstant.TYPE_SHOW_EPISODE,
    aired   : new Date(episode.air_date).getTime(),
    images  : this.formatImage(episode.still_path),
    torrents: this.getEpisodeTorrents(episode.episode_number, pctSeason),
    watched : this.getEpisodeWatched(episode, watchedEpisodes),
  }))

  getEpisodeTorrents = (episodeNumber, pctSeason) => {
    if (!pctSeason || !hasOwnProperty(pctSeason, episodeNumber)) {
      return {
        '1080p': null,
        '720p' : null,
        '480p' : null,
      }
    }

    return pctSeason[episodeNumber].torrents
  }

  getEpisodeWatched = (episode, watchedEpisodes) => {
    const episodeWatched = watchedEpisodes.find(watchedEpisode =>
      watchedEpisode.episode === episode.episode_number
      && watchedEpisode.season === episode.season_number,
    )

    return {
      complete: episodeWatched ? episodeWatched.percentage > 95 : false,
      progress: episodeWatched ? episodeWatched.percentage : 0,
    }
  }

  formatImage = (image) => {
    const replaceWidthPart = (uri: string, size: string) => this.imageUri + size + uri

    return {
      poster: {
        full  : image ? replaceWidthPart(image, 'original') : null,
        high  : image ? replaceWidthPart(image, 'w1280') : null,
        medium: image ? replaceWidthPart(image, 'w780') : null,
        thumb : image ? replaceWidthPart(image, 'w342') : null,
      },
    }
  }

}
