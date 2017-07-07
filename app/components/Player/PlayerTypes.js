/**
 * @flow
 */

import type { MetadataType } from 'api/players/PlayerProviderTypes'

export type Props = {
  uri: ?string,
  metadata: ?MetadataType,
  status: ?string,
  playerType: ?string,
}
