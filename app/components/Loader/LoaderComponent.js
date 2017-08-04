// @flow
import React from 'react'
import classNames from 'classnames'

import type { Props } from './LoaderTypes'
import classes from './Loader.scss'

export const Loader = ({ isLoading, inListItem = false, className = '' }: Props) => (
  <div className={classNames(classes.loader, className, {
    [classes['loader--in-list']]: inListItem,
  })}>
    <div
      style={{
        opacity: isLoading ? 1 : 0,
        display: !isLoading ? 'none' : 'initial',
      }}
      className={classes.loader__container}>
      <div className={classes.loader__dot} />
      <div className={classes.loader__dot} />
      <div className={classes.loader__dot} />
    </div>
  </div>
)

Loader.defaultProps = {
  isLoading: false,
}

export default Loader
