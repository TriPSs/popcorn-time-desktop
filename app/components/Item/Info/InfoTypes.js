/**
 * @flow
 */
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  play: () => void,
}

export type State = {
  trailerTooltipOpen: boolean,
}
