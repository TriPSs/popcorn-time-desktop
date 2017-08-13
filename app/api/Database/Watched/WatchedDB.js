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

  markMovieWatched = (id: string, percentage: number) => this.markWatched({ id, percentage, type: 'movie' })

  markMovieUnWatched = (id: string) => this.unmarkWatched({ id, type: 'movie' })

  getMoviesWatched = () => new Promise(resolve => this.db.find({ type: 'movie' }, (error, docs) =>
    resolve({ error, docs }),
  ))

  updateMoviePercentage = (id: string, percentage: number) =>
    new Promise(resolve =>
      this.db.update({ id, type: 'movie' }, { $set: { percentage } }, {}, (err, numAffected) => {
        if (!numAffected) {
          this.markMovieWatched(id, percentage).then(resolve)

        } else {
          resolve()
        }
      }))

  markEpisodeNotWatched = (showId: string, season: string, episode: string) =>
    this.unmarkWatched({ showId, season, episode, type: 'episode' })

  markEpisodeWatched = (showId: string, season: string, episode: string, percentage: number) =>
    this.markWatched({ showId, season, episode, percentage, type: 'episode' })

  updateEpisodePercentage = (showId: string, season: string, episode: string, percentage: number) =>
    new Promise(resolve =>
      this.db.update({ showId, season, episode, type: 'episode' }, { $set: { percentage } }, {}, (err, numAffected) => {
        if (!numAffected) {
          this.markEpisodeWatched(showId, season, episode, percentage).then(resolve)

        } else {
          resolve()
        }
      }))

  getEpisodesWatchedOfShow = (showId: string) => new Promise(resolve =>
    this.db.find({ showId, type: 'episode' }, (error, docs) => resolve({ error, docs })),
  )

}

export default WatchedDB
