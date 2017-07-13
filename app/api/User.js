import debug from 'debug'
import Database from './Database'

const log = debug('api:user')

export class User {

  bookmarks  = []
  faveorites = []

  extractIds = items => items.map(item => item.imdbId)

  init = () => new Promise((resolve) => {
    Database.bookmarks.getAll().then(({ error, docs }) => {
      const user = {
        bookmarks: [],
      }

      if (!error) {
        this.bookmarks = this.extractIds(docs)
        log('Bookmarks', this.bookmarks)
      }

      resolve()
    })
  })

  isBookmarked = imdbId => this.bookmarks.indexOf(imdbId) > -1

}

export const instance = new User()
export default instance
