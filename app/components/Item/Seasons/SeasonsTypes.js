import type { SeasonType } from 'api/metadata/MetadataTypes'

/**
 * @flow
 */
export type Props = {
  seasons: Array<SeasonType>,
  selectedSeason: number,
  selectedEpisode: number,
  selectSeasonAndEpisode: () => void,
}
