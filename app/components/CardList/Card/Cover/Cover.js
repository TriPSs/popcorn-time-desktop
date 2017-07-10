/**
 * @flow
 */
import React from 'react'
import classNames from 'classnames'

import type { Props } from './CoverTypes'
import classes from './Cover.scss'

export const Cover = ({ image }: Props) => (
  <div
    className={classNames(classes.cover, 'animated', 'fadeIn')}
    style={{
      backgroundImage: `url(${image})`,
    }}>

    <div className={classes.cover__overlay} />
  </div>
)

export default Cover
