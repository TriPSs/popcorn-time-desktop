// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  store: Object,
  history: Object,
  bookmarks: Array<ContentType>,
  watched: Array,
}
