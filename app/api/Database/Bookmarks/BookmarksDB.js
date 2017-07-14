import Datastore from 'nedb'

export class BookmarksDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/bookmarks.db`,
      autoload: true,
    })

    this.db.ensureIndex({
      fieldName: 'id',
      unique   : true,
    })
  }

  getAll = () => new Promise(resolve => this.db.find({}, (error, docs) =>
    resolve(docs.map(item => item.id)),
  ))

  add = (id: string, type: string) => new Promise(resolve => this.db.insert({ id, type }, () =>
    resolve(),
  ))

  remove = (id: string, type: string) => new Promise(resolve => this.db.remove({ id, type }, () =>
    resolve(),
  ))

}

export default BookmarksDB
