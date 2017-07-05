// @flow
import axios from 'axios'

import BaseMetadataProvider from '../BaseMetadataProvider'
import { parseRuntimeMinutesToObject } from '../MetadataAdapter'
import * as Helpers from './PctMetadataHelpers'

import type { MetadataProviderInterface } from '../MetadataProviderInterface'
import type { movieType, showType, showDetailType } from './PctMetadataTypes'

export default class PctMetadataProvider extends BaseMetadataProvider implements MetadataProviderInterface {

  apiUri = 'https://movies-v2.api-fetch.website/'

  popcornAPI: axios

  constructor() {
    super()

    this.popcornAPI = axios.create({
      baseURL: this.apiUri,
    })
  }

  getMovies = (page: number = 1, limit: number = 50) => (
    this.popcornAPI.get(`movies/${page}`, { params: { page, limit } })
        .then(response => this.formatMovies(response.data))
  )

  getMovie = (itemId: string) => (
    this.popcornAPI.get(`movie/${itemId}`)
        .then(response => this.formatMovie(response.data))
  )

  getShows = (page: number = 1, limit: number = 50) => (
    this.popcornAPI.get(`shows/${page}`, { params: { page, limit } })
        .then(response => this.formatShows(response.data))
  )

  getShow = (itemId: string) => (
    this.popcornAPI.get(`show/${itemId}`)
        .then(response => this.formatShow(response.data))
  )

  formatMovies = (movies: Array<movieType>) => (movies.map((movie: movieType) => this.formatMovie(movie)))

  formatMovie = (movie: movieType) => ({
    id           : movie.imdb_id,
    title        : movie.title,
    year         : movie.year,
    certification: movie.certification,
    summary      : movie.synopsis,
    runtime      : parseRuntimeMinutesToObject(movie.runtime),
    trailer      : movie.trailer,
    images       : Helpers.formatImages(movie.images),
    genres       : movie.genres,
    rating       : movie.rating.percentage,
    torrents     : Helpers.formatTorrents(movie.torrents.en),
    type         : 'movie',
  })

  formatShows = (shows: Array<showType>) => (shows.map(show => this.formatShow(show)))

  formatShow = (show: showType | showDetailType, isDetail: boolean = false) => {
    let formattedShow = {
      id         : show.imdb_id,
      title      : show.title,
      year       : show.year,
      images     : Helpers.formatImages(show.images),
      rating     : show.rating.percentage,
      num_seasons: show.num_seasons,
      type       : 'show',
    }

    if (isDetail) {
      formattedShow = {
        ...formattedShow,
        episodes: show.episodes,
      }
    }

    return formattedShow
  }

  getStatus = () => (
    this.popcornAPI.get().then(res => res.ok).catch(() => false)
  )

}
