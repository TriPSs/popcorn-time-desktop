/**
 * @flow
 */
import React from 'react'

import type { Props } from './CoverTypes'
import classes from './Cover.scss'

export const Cover = ({ image }: Props) => (
  <div
    className={classes.cover}
    style={{
      backgroundImage: `url(${image})`,
    }}>
    <div className={classes.cover__overlay} />
  </div>
)

export default Cover
