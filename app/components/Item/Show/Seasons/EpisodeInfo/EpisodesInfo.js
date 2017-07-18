import React from 'react'

import type { Props } from './EpisodesInfoTypes'
import classes from './EpisodesInfo.scss'

export const EpisodeInfo = ({ episode, toggleWatched }: Props) => (
  <div className={classes.episode}>
    <div className={classes.episode__title}>
      {episode.title}
    </div>

    <p>
      {episode.summary}
    </p>

    <button
      onClick={() => toggleWatched(episode)}
      className={'pct-btn--relative pct-btn-trans pct-btn-outline pct-btn-round'}>
      {episode.watched ? 'Unmark Watched' : 'Mark Watched'}
    </button>
  </div>
)

export default EpisodeInfo
