// @flow
import React from 'react'
import classNames from 'classnames'

import Bookmarked from 'components/Bookmarked'
import type { Props } from './CoverTypes'
import classes from './Cover.scss'

export const Cover = ({ item }: Props) => (
  <div
    className={classNames(classes.cover, 'animated', 'fadeIn')}
    style={{
      backgroundImage: `url(${item.images.poster.thumb})`,
    }}>

    <div className={classes.cover__overlay}>
      <Bookmarked item={item} />
    </div>
  </div>
)

export default Cover
