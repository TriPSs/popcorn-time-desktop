import React from 'react'
import classNames from 'classnames'

import type { Props } from './BookmarkedTypes'
import classes from './Bookmarked.scss'

export const Bookmarked = ({ item, bookmarks, toggleBookmark, className }: Props) => {
  const isBookmarked = bookmarks.indexOf(item.id) > -1

  return (
    <div className={className}>
      <i
        onClick={() => toggleBookmark(item)}
        className={classNames('ion-heart',
          isBookmarked ? classes['bookmarked--yes'] : classes['bookmarked--no'],
        )} />
    </div>
  )
}

export default Bookmarked
