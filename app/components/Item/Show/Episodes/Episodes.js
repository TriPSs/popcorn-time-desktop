import React from 'react'
import classNames from 'classnames'

import Watched from 'components/Watched'
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

  getFormattedAired = (aired: number) => {
    const date = new Date(aired)

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getYear()}`
  }

  render() {
    const { selectedSeason, selectedEpisode, selectSeasonAndEpisode } = this.props

    return (
      <div className={'list'}>
        {selectedSeason.episodes.map(episode => (
          <a
            className={classNames('list__item--hor',
              {
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

              {episode.aired > this.tomorrow && (
                <div className={'list__item-overlay-text'}>
                  {this.getFormattedAired(episode.aired)}
                </div>
              )}

              {episode.aired < this.tomorrow && (
                <Watched
                  className={'list__item-watched'}
                  item={episode} />
              )}

              <div className={'list__item-play'}>
                <i className={'ion-ios-play'} />
              </div>

              <div className={'list__item-qualities'}>
                <div className={'list__item-quality list__item-quality--active'}>480p</div>
                <div className={'list__item-quality'}>720p</div>
                <div className={'list__item-quality'}>1080p</div>
              </div>

            </div>

            <div className={'list__item-title'}>
              {episode.title ? episode.title : `Episode ${episode.number}`}
            </div>

            <div className={'list__item-summary'}>
              {episode.summary}
            </div>
          </a>
        ))}
      </div>
    )
  }
}

