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

  markMovieWatched = (id: string) =>
    this.markWatched({ id, type: 'movie' })

  getMoviesWatched = () =>
    this.watched.find({ type: 'movie' })

  markEpisodeWatched = (tvId: string, id: string) =>
    this.markWatched({ tvId, id, type: 'episode' })

  getEpisodesWatched = (tvId: string) =>
    this.watched.find({ tvId, type: 'episode' })

}

export default WatchedDB
