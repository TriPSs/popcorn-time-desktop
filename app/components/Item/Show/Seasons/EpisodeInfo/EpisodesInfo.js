import React from 'react'

import type { Props } from './EpisodesInfoTypes'
import classes from './EpisodesInfo.scss'

export const EpisodeInfo = ({ episode }: Props) => (
  <div className={classes.episode}>
    <div className={classes.episode__title}>
      {episode.title}
    </div>

    <p>
      {episode.summary}
    </p>
  </div>
)

export default EpisodeInfo
