/**
 * @flow
 */

import type { MetadataType } from 'api/players/PlayerProviderTypes'

export type Props = {
  uri: ?string,
  metadata: ?MetadataType,
  playerAction: string,
  playerStatus: ?string,
  playerType: ?string,

  updateStatus: () => void,
}
