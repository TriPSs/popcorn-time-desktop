// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  bookmarks: Array<string>,
  isBookmarked: (id: string, bookmarks: Array<string>) => boolean,
  toggleBookmark: (id: string, type: string) => void,
  className: string,
}
