// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  uri: ?string,
  item: ?ContentType,
  playerAction: string,
  playerStatus: ?string,
  playerProvider: ?string,

  updateStatus: () => void,
}
