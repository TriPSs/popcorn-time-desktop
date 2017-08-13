// @flow
import React from 'react'

import type { Props } from './CardListTypes'
import Card from './Card'
import classes from './CardList.scss'

export const CardList = ({ items, limit }: Props) => (
  <div className={classes.container}>
    {(limit ? items.filter((e, i) => i < limit) : items).map((item, index) => (
      <Card
        key={`item-${index}`}
        item={item} />
    ))}
  </div>
)

export default CardList
