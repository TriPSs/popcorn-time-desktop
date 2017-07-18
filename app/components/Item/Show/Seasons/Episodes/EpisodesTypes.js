// @flow
import type { SeasonType } from 'api/Metadata/MetadataTypes'

export type Props = {
  selectedSeason: SeasonType,
  selectedEpisode: number,
  selectSeasonAndEpisode: () => void,
}

export type State = {
  tooltips: Array,
}
