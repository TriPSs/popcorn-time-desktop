// @flow
import type { ShowType } from '../Metadata/MetadataTypes'

export interface TorrentProviderInterface {

  searchEpisode: (item: ShowType, season: string, episode: string) => Promise<void>,

  search: (search: string) => Promise<void>,

}
