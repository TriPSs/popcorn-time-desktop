import Database from 'api/Database'
import { MetadataProviderInterface } from './MetadataProviderInterface'
import TraktMetadataProvider from './TraktMetadataProvider'
import TmdbMetadataProvider from './TmdbMetadataProvider'
import type { MovieType } from './MetadataTypes'

export default class MetadataAdapter implements MetadataProviderInterface {

  trakt: TraktMetadataProvider

  tmdb: TmdbMetadataProvider

  constructor() {
    this.trakt = new TraktMetadataProvider()
    this.tmdb  = new TmdbMetadataProvider()
  }

  getSeasons = (itemId: string, pctSeasons) => new Promise((resolve) => {
    Database.watched.getEpisodesWatchedOfShow(itemId).then(({ docs }) =>
      this.trakt.getIds(itemId).then(({ ids: { tmdb } }) =>
        this.tmdb.getSeasons(itemId, tmdb, pctSeasons, docs).then(resolve),
      ),
    )
  })

  updateMoviesWatched = (pctMovies: Array<MovieType>) => new Promise((resolve) => {
    Database.watched.getMoviesWatched().then(({ docs }) => resolve(pctMovies.map(pctMovie => ({
      ...pctMovie,
      watched: this.getMovieWatched(pctMovie, docs),
    }))))
  })

  updateMovieWatched = (pctMovie: MovieType) => new Promise((resolve) => {
    Database.watched.getMoviesWatched().then(({ docs }) => resolve({
      ...pctMovie,
      watched: this.getMovieWatched(pctMovie, docs),
    }))
  })

  getMovieWatched = (movie, watchedMovies) => {
    const movieWatched = watchedMovies.find(watchedMovie =>
      watchedMovie.id === movie.id,
    )

    return {
      complete: movieWatched ? movieWatched.percentage > 95 : false,
      progress: movieWatched ? movieWatched.percentage : false,
    }
  }
}
