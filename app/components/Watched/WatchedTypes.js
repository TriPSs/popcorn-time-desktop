// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  watchedItems: Array<string>,
  toggleWatched: () => void,
  className: string,
  icon: boolean,
}
