import React from 'react'
import classNames from 'classnames'

import Database from 'api/Database'
import type { Props } from './BookmarkedTypes'
import classes from './Bookmarked.scss'

export const Bookmarked = ({ item, bookmarks, toggleBookmark }: Props) => {
  const isBookmarked  = bookmarks.indexOf(item.id) > -1

  return (
    <i
      onClick={() => toggleBookmark(item.id, item.type)}
      className={classNames('ion-heart',
        isBookmarked ? classes['bookmarked--yes'] : classes['bookmarked--no'],
      )} />
  )
}

export default Bookmarked
