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

  getAll = () => new Promise(resolve => this.db.find({}, (error, docs) => resolve({ error, docs })))

  add = (imdbId: string, type: string) => this.db.insert({ imdbId, type })

}

export default BookmarksDB
