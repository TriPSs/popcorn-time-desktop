// @flow
import type { RatingType } from 'api/metadata/MetadataTypes'

export type Props = {
  rating: RatingType,
  starColor: string,
  emptyStarColor?: string
}
