import type { ContentType } from 'api/metadata/MetadataTypes'
import { PlayerProviderInterface } from 'api/players/PlayerProviderInterface'

export type Props = {
  item: ContentType,
  isLoading: boolean,

  player: PlayerProviderInterface,
}

export type State = {
  item: itemType,
  similarItems: Array<ContentType>,
  selectedSeason: number,
  selectedEpisode: number,
  seasons: [],
  season: [],
  episode: {},
  episodes: [],
  //  castingDevices: Array<deviceType>,
  playbackIsActive: boolean,
  fetchingTorrents: boolean,
  dropdownOpen: boolean,
  // idealTorrent: torrentType,
  // torrent: torrentSelectionType,
  servingUrl: string,
  similarLoading: boolean,
  metadataLoading: boolean,
  torrentInProgress: boolean,
  torrentProgress: number,
  isFinished: boolean
}
