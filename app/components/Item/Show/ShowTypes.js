import type { TorrentType } from 'api/Torrents/TorrentType'
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  fetchingEpisodeTorrents: boolean,
  play: (playerProvider: string, torrent: TorrentType) => void,
}

export type State = {
  selectedSeason: number,
  selectedEpisode: number,
}
