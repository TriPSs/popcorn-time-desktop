import Datastore from 'nedb'

export class WatchedDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/watched.db`,
      autoload: true,
    })
  }

  markWatched = data => this.watched.insert({ ...data, date: new Date() })

  markMovieWatched = (imdbId: string) =>
    this.markWatched({ imdbId, type: 'movie' })

  getMoviesWatched = () =>
    this.watched.find({ type: 'movie' })

  markEpisodeWatched = (tvdbId: string, imdbId: string) =>
    this.markWatched({ tvdbId, imdbId, type: 'episode' })

  getEpisodesWatched = (tvdbId: string) =>
    this.watched.find({ tvdbId, type: 'episode' })

}

export default WatchedDB
