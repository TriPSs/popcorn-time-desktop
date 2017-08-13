// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { StatsType } from 'api/Torrent/TorrentTypes'

export type Props = {
  item: ContentType,
  torrentStatus: string,
  playerProvider: string,
  stats: StatsType,
  stop: () => void,
}
