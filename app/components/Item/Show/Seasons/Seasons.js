import React from 'react'
import classNames from 'classnames'

import placeHolderImage from 'images/posterholder.png'
import type { Props } from './SeasonsTypes'
import classes from './Seasons.scss'

export const Seasons = ({ seasons, selectSeasonAndEpisode, selectedSeason }: Props) => (
  <div className={'list'}>
    {seasons.map(season => (
      <a
        className={classNames('list__item list__item--available', {
          'list__item--active': season.number === selectedSeason.number,
        })}
        key={season.number}
        onClick={() => selectSeasonAndEpisode(season.number)}
      >
        <div className={'list__item-image-container'}>
          <img
            className={classNames(
              'list__item-image',
              'animated fadeIn',
              { 'list__item-image-placeholder': !season.images },
            )}
            src={season.images ? season.images.poster.thumb : placeHolderImage}
            alt={season.title} />

          <div className={'list__item-overlay'} />
        </div>

        <div className={'list__item-title'}>
          {season.title}
        </div>
      </a>
    ))}
  </div>
)

export default Seasons
