import React from 'react'
import classNames from 'classnames'

import placeHolderImage from 'images/posterholder.png'
import type { Props } from './EpisodesTypes'

export default class extends React.Component {

  props: Props

  constructor(props) {
    super(props)

    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    this.tomorrow = tomorrowDate.getTime()
  }

  tomorrow: number

  render() {
    const { selectedSeason, selectedEpisode, selectSeasonAndEpisode } = this.props

    return (
      <div className={'col-sm-6 list'}>
        {selectedSeason.episodes.map(episode => (
          <a
            className={classNames('list__item--hor', {
                'list__item--active' : episode.number === selectedEpisode.number,
                'list__item--watched': episode.watched && episode.number !== selectedEpisode.number,
              }, episode.aired > this.tomorrow
              ? 'list__item--disabled'
              : 'list__item--available',
            )}
            key={episode.number}
            onClick={() => episode.aired < this.tomorrow
              ? selectSeasonAndEpisode(selectedSeason.number, episode.number)
              : null}
          >
            <div className={'list__item-image-container--hor'}>
              <img
                className={classNames(
                  'animated fadeIn',
                  'list__item-image',
                  { 'list__item-image-placeholder': !episode.images },
                )}
                src={episode.images ? episode.images.poster.thumb : placeHolderImage}
                alt={episode.title} />

              <div className={'list__item-overlay'} />
            </div>

            <div className={'list__item-title'}>
              {episode.title ? `${episode.number}. ${episode.title}` : `Episode ${episode.number}`}
            </div>
          </a>
        ))}
      </div>
    )
  }
}

