/**
 * @flow
 */

import type { MetadataType } from 'api/Player/PlayerTypes'

export type Props = {
  uri: ?string,
  metadata: ?MetadataType,
  playerAction: string,
  playerStatus: ?string,
  playerProvider: ?string,

  updateStatus: () => void,
}
