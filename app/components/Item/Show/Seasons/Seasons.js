/**
 * Created by tycho on 10/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import type { Props } from './SeasonsTypes'
import Episodes from './Episodes'
import EpisodeInfo from './EpisodeInfo'
import classes from './Seasons.scss'

export const Seasons = ({ seasons, selectSeasonAndEpisode, selectedSeason, selectedEpisode }: Props) => (
  <div className={'col-sm-12'}>
    <div className={classNames('col-sm-2', classes.seasons)}>
      <div className={classNames('list', classes.seasons__list)}>
        {seasons.map(season => (
          <a
            className={classNames('list-item', {
              'list-item--active': season.number === selectedSeason.number,
            })}
            key={season.number}
            onClick={() => selectSeasonAndEpisode(season.number, 1)}
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

      <EpisodeInfo episode={selectedEpisode} />

    </div>
  </div>
)

export default Seasons
