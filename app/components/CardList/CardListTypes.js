// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  title?: string,
  limit?: number,
  items: Array<ContentType>,
  isLoading?: boolean,
  isFinished?: boolean
}
