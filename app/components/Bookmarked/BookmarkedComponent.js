import React from 'react'
import classNames from 'classnames'

import User from 'api/User'
import Database from 'api/Database'
import type { Props } from './BookmarkedTypes'
import classes from './Bookmarked.scss'

export const Bookmarked = ({ item }: Props) => {
  const handleOnClick = (imdbId, type) => Database.bookmarks.add(imdbId, type)
  const isBookmarked  = User.isBookmarked(item.id)

  return (
    <i
      onClick={() => handleOnClick(item.id, item.type)}
      className={classNames('ion-heart',
        isBookmarked ? classes['bookmarked--yes'] : classes['bookmarked--no'],
      )} />
  )
}

export default Bookmarked
