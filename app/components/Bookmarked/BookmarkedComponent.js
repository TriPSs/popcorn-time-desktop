import React from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import type { Props } from './BookmarkedTypes'
import classes from './Bookmarked.scss'

export default ({ item, bookmarks, toggleBookmark, className, tooltip = { effect: 'solid', place: 'top' }, }: Props) => {
  const isBookmarked = bookmarks.indexOf(item.id) > -1

  const bookmarkID = `${item.id}-bookmark-tooltip`
  return (
    <div
      data-tip
      data-for={bookmarkID}
      className={className}>
      <i
        onClick={() => toggleBookmark(item)}
        className={classNames('ion-heart',
          isBookmarked ? classes['bookmarked--yes'] : classes['bookmarked--no'],
        )} />
      <ReactTooltip id={bookmarkID} {...tooltip}>
        {isBookmarked ? 'Remove from ' : 'Add to '}bookmarks
      </ReactTooltip>
    </div>
  )
}
