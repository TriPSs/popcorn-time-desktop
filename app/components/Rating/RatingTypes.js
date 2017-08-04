// @flow
import type { RatingType } from 'api/Metadata/MetadataTypes'

export type Props = {
  rating: RatingType,
  starColor: string,
  emptyStarColor?: string
}
