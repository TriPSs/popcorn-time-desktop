import type { ContentType, TorrentType } from 'api/metadata/MetadataTypes'
import { PlayerProviderInterface } from 'api/players/PlayerProviderInterface'

export type Props = {
  item: ContentType,
  isLoading: boolean,

  player: PlayerProviderInterface,
}

export type State = {
  torrent: TorrentType,
}