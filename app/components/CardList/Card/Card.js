/**
 * Card in the CardList component
 * @flow
 */
import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classNames'

import Rating from 'components/Rating'

import type { Props } from './CardTypes'

import Cover from './Cover'
import classes from './Card.scss'

export const Card = ({ type, image, id, rating, title, starColor }: Props) => (
  <div className={classNames(classes.card, 'animated', 'fadeInUp')}>

    <Link replace to={`/item/${type}/${id}`}>
      <Cover {...{ image }} />
    </Link>

    <div className={classes.card__description}>
      <Link className={classes.card__title} replace to={`/item/${type}/${id}`}>
        {title}
      </Link>

      <Rating {...{ starColor, rating }} />
    </div>

  </div>
)

Card.defaultProps = {
  starColor: '#848484',
}

export default Card
