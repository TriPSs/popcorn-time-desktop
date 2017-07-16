// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  torrentStatus: string,
  playerProvider: string,
  stopPlayer: () => void
}

export type State = {
  progress: number,
  timeRemaining: number,
  downloadSpeed: number,
  uploadSpeed: number,
  peers: number,
}
