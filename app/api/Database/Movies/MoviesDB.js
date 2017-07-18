import Datastore from 'nedb'

export class MoviesDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/movies.db`,
      autoload: true,
    })

    this.db.ensureIndex({
      fieldName: 'id',
      unique   : true,
    })
  }

  add = (data: Object) => new Promise(resolve => this.db.insert(data, () =>
    resolve(),
  ))

  get = (id: string) => new Promise(resolve => this.db.findOne({ id }, (error, docs) =>
    resolve({ error, docs }),
  ))

  getAll = () => new Promise(resolve => this.db.find({}, (error, docs) =>
    resolve({ error, docs }),
  ))

  remove = (id: string) => new Promise(resolve => this.db.remove({ id }, () =>
    resolve(),
  ))

}

export default MoviesDB
