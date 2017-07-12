import { remote } from 'electron'
import Datastore from 'nedb'
import debug from 'debug'

const log = debug('api:database')

export class Database {

  dbLocation: string

  bookmarks: Datastore

  watched: Datastore

  constructor() {
    this.dbLocation = remote.app.getPath('userData')

    log(`Using ${this.dbLocation} as database location...`)

    this.bookmarks = new Datastore({
      filename: `${this.dbLocation}/data/bookmarks.db`,
      autoload: true,
    })

    this.bookmarks.ensureIndex({
      fieldName: 'imdbId',
      unique   : true,
    })

    this.watched = new Datastore({
      filename: `${this.dbLocation}/data/watched.db`,
      autoload: true,
    })
  }

  addBookmark = (imdbId, type) => this.bookmarks.insert({ imdbId, type, })

}

export const instance = new Database()
export default instance
