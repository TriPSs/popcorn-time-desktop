// @flow
import React from 'react'

import type { Props } from './ProgressTypes'
import classes from './Progress.scss'

export default ({ item }: Props) => (
  <div className={classes.container}>

    <div style={{ width: `${item.watched.progress}%` }} />
  </div>
)
