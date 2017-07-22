import React from 'react'
import classNames from 'classnames'

import type { Props } from './WatchedTypes'
import classes from './Watched.scss'

export const Watched = ({ item, watchedItems, toggleWatched, className, icon }: Props) => {
  const isWatched = watchedItems.indexOf(item.id) > -1

  return (
    <div className={className}>
      {icon && (
        <i
          onClick={() => toggleWatched(item)}
          className={classNames('ion-eye',
            isWatched ? classes['watched--yes'] : classes['watched--no'],
          )} />
      )}

      {!icon && (
        <button
          onClick={() => toggleWatched(item)}
          className={'pct-btn--relative pct-btn-trans pct-btn-outline pct-btn-round'}>
          {isWatched ? 'Unmark Watched' : 'Mark Watched'}
        </button>
      )}
    </div>
  )
}

export default Watched
