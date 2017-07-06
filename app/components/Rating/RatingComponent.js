// @flow
import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

import type { Props } from './RatingTypes'

export const Rating = ({ rating, starColor, emptyStarColor }: Props) => (
  <StarRatingComponent
    renderStarIconHalf={() => <span className="ion-android-star-half" />}
    renderStarIcon={() => <span className="ion-android-star" />}
    name={'rating'}
    starColor={starColor}
    emptyStarColor={emptyStarColor}
    value={rating.stars}
    editing={false}
  />
)

Rating.defaultProps = {
  rating        : 0,
  starColor     : '#848484',
  emptyStarColor: 'rgba(255, 255, 255, 0.2)',
}

export default Rating
