import React from 'react'

import classes from './Progress.scss'

export default ({ item }) => (
  <div className={classes.container}>

    <div style={{ width: `${item.watched.progress}%` }} />
  </div>
)
