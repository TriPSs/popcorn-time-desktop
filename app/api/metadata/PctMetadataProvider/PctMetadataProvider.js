// @flow
import axios from 'axios'

import BaseMetadataProvider from '../BaseMetadataProvider'
import * as Helpers from './PctMetadataHelpers'

import type { MetadataProviderInterface } from '../MetadataProviderInterface'
import type { MovieType, ShowType, ShowDetailType } from './PctMetadataTypes'

export default class PctMetadataProvider extends BaseMetadataProvider implements MetadataProviderInterface {

  popcornAPI: axios = axios.create({
    baseURL: 'https://movies-v2.api-fetch.website/',
  })

  getMovies = (page: number = 1, filters = { limit: 50, sort: 'trending' }) => (
    this.popcornAPI.get(`movies/${page}`, { params: { ...filters } })
        .then(response => this.formatMovies(response.data))
  )

  getMovie = (itemId: string) => (
    this.popcornAPI.get(`movie/${itemId}`)
        .then(response => this.formatMovie(response.data))
  )

  getShows = (page: number = 1, filters = { limit: 50, sort: 'trending' }) => (
    this.popcornAPI.get(`shows/${page}`, { params: { ...filters } })
        .then(response => this.formatShows(response.data))
  )

  getShow = (itemId: string) => (
    this.popcornAPI.get(`show/${itemId}`)
        .then(response => this.formatShow(response.data, true))
  )

  formatMovies = (movies: Array<MovieType>) => (movies.map((movie: MovieType) => this.formatMovie(movie)))

  formatMovie = (movie: MovieType) => ({
    id           : movie.imdb_id,
    title        : movie.title,
    year         : movie.year,
    certification: movie.certification,
    summary      : movie.synopsis,
    runtime      : this.formatRuntimeMinutesToObject(movie.runtime),
    trailer      : movie.trailer,
    images       : Helpers.formatImages(movie.images),
    genres       : movie.genres,
    rating       : Helpers.formatRating(movie.rating),
    torrents     : Helpers.formatTorrents(movie.torrents.en),
    type         : 'movie',
  })

  formatShows = (shows: Array<ShowType>) => (shows.map(show => this.formatShow(show)))

  formatShow = (show: ShowType | ShowDetailType, isDetail: boolean = false) => {
    let formattedShow = {
      id         : show.imdb_id,
      title      : show.title,
      year       : show.year,
      images     : Helpers.formatImages(show.images),
      rating     : Helpers.formatRating(show.rating),
      num_seasons: show.num_seasons,
      type       : 'show',
    }

    if (isDetail) {
      formattedShow = {
        ...formattedShow,
        runtime: this.formatRuntimeMinutesToObject(show.runtime),
        seasons: Helpers.formatShowEpisodes(show.episodes),
        summary: show.synopsis,
        genres : show.genres,
        status : show.status,
      }
    }

    return formattedShow
  }

  getStatus = () => (
    this.popcornAPI.get().then(res => res.ok).catch(() => false)
  )

}
