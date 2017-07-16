import Datastore from 'nedb'

export class WatchedDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/watched.db`,
      autoload: true,
    })
  }

  markWatched = data => new Promise(resolve => this.db.insert({ ...data, date: new Date() }, () =>
    resolve(),
  ))

  unmarkWatched = data => new Promise(resolve => this.db.remove({ ...data }, () =>
    resolve(),
  ))

  markMovieWatched = (id: string) =>
    this.markWatched({ id, type: 'movie' })

  getMoviesWatched = () => new Promise(resolve => this.db.find({ type: 'movie' }, (error, docs) =>
    resolve({ error, docs }),
  ))

  markEpisodeNotWatched = (showId: string, season: string, episode: string) =>
    this.unmarkWatched({ showId, season, episode, type: 'episode' })

  markEpisodeWatched = (showId: string, season: string, episode: string) =>
    this.markWatched({ showId, season, episode, type: 'episode' })

  getEpisodesWatchedOfShow = (showId: string) =>
    new Promise(resolve => this.db.find(
      {
        showId,
        type: 'episode',
      }, (error, docs) => resolve({ error, docs }),
    ))

}

export default WatchedDB
