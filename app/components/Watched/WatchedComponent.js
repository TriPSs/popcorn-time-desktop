import React from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import type { Props } from './WatchedTypes'
import classes from './Watched.scss'

export default ({ item, watchedItems, toggleWatched, className, tooltip = { effect: 'solid', place: 'top' }, }: Props) => {
  const isWatched = (item.watched ? item.watched.complete : false) || watchedItems.indexOf(item.id) > -1
  const watchedID = `${item.id}-watched-tooltip`

  return (
    <div
      data-tip
      data-for={watchedID}
      className={className}>
      <i
        onClick={() => toggleWatched({ ...item, watched: isWatched })}
        className={classNames({
          'ion-eye-disabled'       : isWatched,
          'ion-eye'                : !isWatched,
          [classes['watched--yes']]: isWatched,
          [classes['watched--no']] : !isWatched,
        })} />
      <ReactTooltip id={watchedID} {...tooltip}>
        Mark {isWatched ? 'unwatched' : 'watched'}
      </ReactTooltip>
    </div>
  )
}
