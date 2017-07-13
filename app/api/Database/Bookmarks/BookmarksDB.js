import Datastore from 'nedb'

export class BookmarksDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/bookmarks.db`,
      autoload: true,
    })

    this.db.ensureIndex({
      fieldName: 'imdbId',
      unique   : true,
    })
  }

  getAll = () => new Promise(resolve => this.db.find({}, (error, docs) =>
    resolve({ error, docs })),
  )

  add = (imdbId: string, type: string) => new Promise(resolve => this.db.insert({ imdbId, type }, () =>
    resolve(),
  ))

  remove = (imdbId: string, type: string) => new Promise(resolve => this.db.remove({ imdbId, type }, () =>
    resolve(),
  ))

}

export default BookmarksDB
