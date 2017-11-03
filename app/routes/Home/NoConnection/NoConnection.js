import React from 'react'

import classes from './NoConnection.scss'

export default ({ getItems }) => (
  <div className={classes.root}>
    <div className={classes.content}>
      <h2>
        There's no connection to the internet!
      </h2>

      <button
        className={'pct-btn pct-btn-trans pct-btn-outline pct-btn-round'}
        onClick={getItems}>
        Try Again
      </button>
    </div>
  </div>
)
