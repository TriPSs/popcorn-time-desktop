import type { TorrentType } from 'api/Torrents/TorrentsTypes'
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  fetchingEpisodeTorrents: boolean,
  play: (playerProvider: string, torrent: TorrentType) => void,
  playerStatus: string,
  torrentStatus: string,
}

export type State = {
  selectedSeason: number,
  selectedEpisode: number,
}
