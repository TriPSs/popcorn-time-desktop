// @flow
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
        {(limit ? items.filter((e, i) => i < limit) : items).map((item, index) => (
          <Card
            key={`item-${index}`}
            item={item} />
        ))}
      </div>
    </div>

    <div className="col-12">
      <Loader {...{ isLoading, isFinished }} />
    </div>
  </div>
)

export default CardList
