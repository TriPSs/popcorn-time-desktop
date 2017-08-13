import Datastore from 'nedb'

export default class {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/settings.db`,
      autoload: true,
    })

    this.db.ensureIndex({
      fieldName: 'key',
      unique   : true,
    })
  }

  add = (key: string, value: string) => new Promise(resolve => this.db.insert({ key, value }, resolve))

  get = (key: string) => new Promise(resolve => this.db.find({ key }, (error, docs) => {
    if (error) {
      return resolve({ error, docs })
    }

    if (!docs.length) {
      return resolve({ error, docs: false })
    }

    if (docs.length && docs.length === 1) {
      return resolve({ error, docs: docs[0] })
    }

    return resolve({ error, docs })

  }))

  getAll = () => new Promise(resolve => this.db.find({}, (error, docs) =>
    resolve({ error, docs }),
  ))

  update = (key: string, value: string) => new Promise(resolve => this.db.update({ key, value }, resolve))

  remove = (key: string) => new Promise(resolve => this.db.remove({ key }, resolve))

}
