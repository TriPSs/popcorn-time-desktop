import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  provider: string,
  action: string,
  uri: string,
  item: ContentType,
}
