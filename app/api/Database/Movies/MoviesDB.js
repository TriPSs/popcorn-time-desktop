import Datastore from 'nedb'

export class MoviesDB {

  db: Datastore

  constructor(dbLocation: string) {
    this.db = new Datastore({
      filename: `${dbLocation}/data/movies.db`,
      autoload: true,
    })

    this.db.ensureIndex({
      fieldName: 'imdb_id',
      unique   : true,
    })
  }

  add = (data) => this.db.insert(data)

  remove = (imdbId: string) => this.db.remove({ imdbId })

  getMovie = (imdbId: string) => this.db.findOne({ imdbId })

}

export default MoviesDB
