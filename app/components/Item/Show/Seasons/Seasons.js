import React from 'react'
import classNames from 'classnames'

import placeHolderImage from 'images/posterholder.png'
import type { Props } from './SeasonsTypes'
import classes from './Seasons.scss'

export const Seasons = ({ seasons, selectSeasonAndEpisode, selectedSeason, selectedEpisode }: Props) => (
  <div className={'col-sm-4 list'}>
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

/*export const Seasons = ({ seasons, selectSeasonAndEpisode, selectedSeason, selectedEpisode }: Props) => (
  <div className={'col-sm-12'}>
    <div className={classNames('col-sm-2', classes.seasons)}>
      <div className={classNames('list', classes.seasons__list)}>
        {seasons.map(season => (
          <a
            className={classNames('list-item', {
              'list-item--active': season.number === selectedSeason.number,
            })}
            key={season.number}
            onClick={() => selectSeasonAndEpisode(season.number)}
          >
            <div className={'list-item__text'}>
              {season.title}
            </div>
          </a>
        ))}
      </div>
    </div>

    <div className={classNames('col-sm-4', classes.seasons)}>

      <Episodes
        {...{
          selectedSeason,
          selectedEpisode,
          selectSeasonAndEpisode,
        }} />

    </div>

    <div className={classNames('col-sm-6', classes.seasons)}>

      <EpisodeInfo
        {...{
          selectSeasonAndEpisode,
          episode: selectedEpisode,
        }} />

    </div>
  </div>
)*/

export default Seasons
