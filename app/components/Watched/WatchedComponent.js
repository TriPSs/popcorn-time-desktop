import React from 'react'
import classNames from 'classnames'

import type { Props } from './WatchedTypes'
import classes from './Watched.scss'

export default ({ item, watchedItems, toggleWatched, className }: Props) => {
  const isWatched = (item.watched ? item.watched.complete : false) || watchedItems.indexOf(item.id) > -1

  return (
    <div className={className}>
      <i
        onClick={() => toggleWatched({ ...item, watched: isWatched })}
        className={classNames({
          'ion-eye-disabled'       : isWatched,
          'ion-eye'                : !isWatched,
          [classes['watched--yes']]: isWatched,
          [classes['watched--no']] : !isWatched,
        })} />
    </div>
  )
}
