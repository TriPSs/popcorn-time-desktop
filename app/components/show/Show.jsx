// @flow
import React from 'react'
import classNames from 'classnames'

import type { Props } from './ShowConstants'

export default function Show(props: Props) {
  const { seasons, selectedSeason, selectedEpisode} = props;

  return (
    <div className="row">
      <div className="col-sm-12 col-md-6">
        <h4>Seasons:</h4>
        <div className="list-group">
          {seasons.map(season =>
            <a
              className={classNames('list-group-item', {
                active: season.season === selectedSeason
              })}
              key={season.season}
            >
              Season {season.season}
            </a>
          )}
        </div>
      </div>

      <div className="col-sm-12 col-md-6">
        <h4>Episodes:</h4>
        <div className="list-group">
          {seasons[selectedSeason].episodes.map(episode =>
            <a
              className={classNames('list-group-item', {
                active: episode.episode === selectedEpisode
              })}
              key={episode.episode}
            >
              Ep {episode.episode}. {episode.title}
            </a>
          )}
        </div>
      </div>

      <ul>
        <li>
          <h3>Season overview:</h3>
        </li>
        <li>
          <h6>
            {seasons.length && selectedSeason && seasons[selectedSeason]
              ? seasons[selectedSeason].overview
              : null}
          </h6>
        </li>
      </ul>
      <ul>
        <li>
          <h3>Episode overview:</h3>
        </li>
        <li>
          <h6>
            {seasons[selectedSeason].episodes.length && selectedSeason && seasons[selectedSeason].episodes[selectedEpisode]
              ? seasons[selectedSeason].episodes[selectedEpisode].overview
              : null}
          </h6>
        </li>
      </ul>
    </div>
  )
}

Show.defaultProps = {
  seasons : [],
  episodes: [],
  episode : {}
};
