import Database from 'api/Database'
import { MetadataProviderInterface } from './MetadataProviderInterface'
import TraktMetadataProvider from './TraktMetadataProvider'
import TmdbMetadataProvider from './TmdbMetadataProvider'

export class MetadataAdapter implements MetadataProviderInterface {

  trakt: TraktMetadataProvider

  tmdb: TmdbMetadataProvider

  constructor() {
    this.trakt = new TraktMetadataProvider()
    this.tmdb  = new TmdbMetadataProvider()
  }

  getSeasons = (itemId: string, pctSeasons) => new Promise((resolve) => {
    Database.watched.getEpisodesWatchedOfShow(itemId).then(({ docs }) =>
      this.trakt.getIds(itemId).then(({ ids: { tmdb } }) =>
        this.tmdb.getSeasons(itemId, tmdb, pctSeasons, docs).then(resolve),
      ),
    )
  })

}

export default MetadataAdapter
