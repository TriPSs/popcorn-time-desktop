// @flow
import Trakt from 'trakt.tv'

import type { TraktItemType } from './TraktMetadataTypes'
import type { MetadataProviderInterface } from '../MetadataProviderInterface'

export default class TraktMetadataAdapter implements MetadataProviderInterface {

  clientId     = '647c69e4ed1ad13393bf6edd9d8f9fb6fe9faf405b44320a6b71ab960b4540a2'
  clientSecret = 'f55b0a53c63af683588b47f6de94226b7572a6f83f40bd44c58a7c83fe1f2cb1'

  trakt: Trakt

  constructor() {
    this.trakt = new Trakt({
      client_id     : this.clientId,
      client_secret : this.clientSecret,
      useElectronNet: false,
    })
  }

  getIds = (itemId: string): TraktItemType => this.trakt.shows.summary({ id: itemId })

}
