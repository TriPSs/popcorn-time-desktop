import Database from 'api/Database'
import { MetadataProviderInterface } from './MetadataProviderInterface'
import TraktMetadataProvider from './TraktMetadataProvider'

export class MetadataAdapter implements MetadataProviderInterface {

  providers = [
    new TraktMetadataProvider(),
  ]

  getSeasons = (itemId: string, pctSeasons) => new Promise(resolve =>
    Database.watched.getEpisodesWatchedOfShow(itemId).then(({ docs }) => Promise.all(
      this.providers.map(provider => provider.getSeasons(itemId, pctSeasons, docs)),
      ).then((response) => {
        const seasons = []

        response.forEach(providerSeasons => providerSeasons.forEach((season) => {
          seasons.push({
            ...season,
          })
        }))

        resolve(seasons)
      }),
    ),
  )

}

export default MetadataAdapter
