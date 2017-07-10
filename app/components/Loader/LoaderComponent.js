// @flow
import React from 'react'

import type { Props } from './LoaderTypes'
import classes from './Loader.scss'

export const Loader = ({ isLoading, isFinished }: Props) => (
  <div className={classes.loader}>
    <div
      style={{
        opacity: isLoading ? 1 : 0,
        display: isFinished ? 'none' : 'initial',
      }}
      className={classes.loader__container}>
      <div className={classes.loader__dot} />
      <div className={classes.loader__dot} />
      <div className={classes.loader__dot} />
    </div>
  </div>
)

Loader.defaultProps = {
  isLoading : false,
  isFinished: false,
}

export default Loader
