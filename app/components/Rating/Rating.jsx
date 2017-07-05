// @flow
import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

type Props = {
  rating: number | 'n/a',
  starColor: string,
  emptyStarColor?: string
};

export const Rating = (props: Props) => {
  if (typeof props.rating !== 'number') {
    return
  }

  return (
    <StarRatingComponent
      renderStarIconHalf={() => <span className="ion-android-star-half" />}
      renderStarIcon={() => <span className="ion-android-star" />}
      name={'rating'}
      starColor={props.starColor}
      emptyStarColor={props.emptyStarColor}
      value={props.rating / 2}
      editing={false}
    />
  )
}

Rating.defaultProps = {
  rating        : 0,
  starColor     : '#848484',
  emptyStarColor: 'rgba(255, 255, 255, 0.2)',
}

export default Rating
