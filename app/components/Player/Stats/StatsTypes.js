// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  torrentStatus: string,
}

export type State = {
  progress: nunber,
  timeRemaining: number,
  downloadSpeed: number,
  uploadSpeed: number,
  peers: number,
}
