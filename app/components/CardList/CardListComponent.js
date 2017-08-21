// @flow
import React from 'react'

import type { Props } from './CardListTypes'
import Card from './Card'
import classes from './CardList.scss'

export default ({ items }: Props) => (
  <div className={classes.container}>
    {Array.from(new Set(items)).map(item => (
      <Card
        key={item.id}
        item={item} />
    ))}
  </div>
)
