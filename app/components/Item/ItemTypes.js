import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { TorrentType } from 'api/Torrents/TorrentsTypes'
import { PlayerProviderInterface } from 'api/players/PlayerProviderInterface'

export type Props = {
  item: ContentType,
  isLoading: boolean,
  fetchingEpisodeTorrents: boolean,

  player: PlayerProviderInterface,
  playerStatus: string,
}

export type State = {
  torrent: TorrentType,
  torrentStatus: string,
}
