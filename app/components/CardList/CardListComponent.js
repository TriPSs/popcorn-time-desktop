// @flow
import React from 'react'

import Loader from 'components/Loader'

import type { Props } from './CardListTypes'
import Card from './Card'
import classes from './CardList.scss'

export const CardList = ({ items, isLoading, limit }: Props) => (
  <div className={classes.container}>
    {(limit ? items.filter((e, i) => i < limit) : items).map((item, index) => (
      <Card
        key={`item-${index}`}
        item={item} />
    ))}

    <Loader {...{ isLoading }} />
  </div>
)

export default CardList
