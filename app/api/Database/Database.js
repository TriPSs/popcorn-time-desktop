import { remote } from 'electron'
import debug from 'debug'

import WatchedDB from './Watched'
import BookmarksDB from './Bookmarks'
import MoviesDB from './Movies'
import ShowsDB from './Shows'
import SettingsDB from './Settings'

const log = debug('api:database')

export class Database {

  watched: WatchedDB

  bookmarks: BookmarksDB

  movies: MoviesDB

  shows: ShowsDB

  settings: SettingsDB

  constructor() {
    const dbLocation = remote.app.getPath('userData')

    log(`Using ${dbLocation} as database location...`)

    this.watched   = new WatchedDB(dbLocation)
    this.bookmarks = new BookmarksDB(dbLocation)
    this.movies    = new MoviesDB(dbLocation)
    this.shows     = new ShowsDB(dbLocation)
    this.settings  = new SettingsDB(dbLocation)
  }

}

export const instance = new Database()
export default instance
