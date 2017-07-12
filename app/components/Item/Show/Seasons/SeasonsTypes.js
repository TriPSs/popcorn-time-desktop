// @flow
import type { SeasonType } from 'api/Metadata/MetadataTypes'

export type Props = {
  seasons: Array<SeasonType>,
  selectedSeason: number,
  selectedEpisode: number,
  selectSeasonAndEpisode: () => void,
}
