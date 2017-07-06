/**
 * A list of thumbnail poster images of items that are rendered on the home page
 * @flow
 */
import React from 'react'

import Loader from 'components/Loader'

import type { Props } from './CardListTypes'

import Card from './Card'
import classes from './CardList.scss'

export const CardList = ({ items, isLoading, isFinished, title, limit }: Props) => (
  <div className="row">
    <div className="col-12">
      {title && (
        <h4 className={classes.header}>
          {title}
        </h4>
      )}

      <div className={classes.container}>
        {(limit ? items.filter((e, i) => i < limit) : items).map(item => (
          <Card
            image={item.images.fanart.medium}
            title={item.title}
            id={item.id}
            key={item.id}
            type={item.type}
            rating={item.rating} />
        ))}
      </div>
    </div>

    <div className="col-12">
      <Loader {...{ isLoading, isFinished }} />
    </div>
  </div>
)

CardList.defaultProps = {
  title     : null,
  limit     : null,
  items     : [],
  isLoading : false,
  isFinished: false,
  starColor : '#848484',
}

export default CardList
