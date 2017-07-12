import { MetadataProviderInterface } from './MetadataProviderInterface'
import TraktMetadataProvider from './TraktMetadataProvider'

export class MetadataAdapter implements MetadataProviderInterface {

  providers = [
    new TraktMetadataProvider(),
  ]

  getSeasons = (itemId: string, pctSeasons) => Promise.all(
    this.providers.map(provider => provider.getSeasons(itemId, pctSeasons)),
  )

}

export default MetadataAdapter
