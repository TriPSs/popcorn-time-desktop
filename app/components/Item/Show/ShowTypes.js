import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  fetchingEpisodeTorrents: boolean,
}

export type State = {
  selectedSeason : number,
  selectedEpisode: number,
}
