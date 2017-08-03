import type { TorrentType } from 'api/Torrents/TorrentsTypes'
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  play: (playerProvider: string, torrent: TorrentType) => void,
  selectedSeason: number,
  selectedEpisode: number,
}

