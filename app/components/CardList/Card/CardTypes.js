/**
 * Card in the CardList component
 * @flow
 */
import type { RatingType } from 'api/metadata/MetadataTypes'

export type Props = {
  title: string,
  starColor?: string,
  image: string,
  id: string,
  rating: RatingType,
  type: string,
}
