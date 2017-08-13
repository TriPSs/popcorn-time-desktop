// @flow
import type { TorrentType } from 'api/Torrents/TorrentsTypes'
import type { EpisodeType } from 'api/Metadata/MetadataTypes'

export type Props = {
  episode: EpisodeType,
  selectedEpisode: number,
  selectSeasonAndEpisode: () => void,
  setSelectedEpisodeRef: () => void,
}

export type State = {
  torrent: TorrentType,
}
