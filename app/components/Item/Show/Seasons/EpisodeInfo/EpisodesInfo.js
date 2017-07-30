import React from 'react'

import type { Props } from './EpisodesInfoTypes'
import classes from './EpisodesInfo.scss'

import Watched from 'components/Watched'

export default class extends React.Component {

  props: Props

  componentWillReceiveProps(nextProps) {
    const { episode: newEpisode } = nextProps
    const { episode: oldEpisode } = this.props

    if (newEpisode.id === oldEpisode.id && newEpisode.watched && !oldEpisode.watched) {
      const { selectSeasonAndEpisode } = this.props

      selectSeasonAndEpisode(null, null)
    }
  }

  render() {
    const { episode } = this.props

    return (
      <div className={classes.episode}>
        <div className={classes.episode__title}>
          {episode.title}

          <Watched
            className={classes.episode__watched}
            item={episode} />
        </div>

        <p>
          {episode.summary}
        </p>
      </div>
    )
  }
}
