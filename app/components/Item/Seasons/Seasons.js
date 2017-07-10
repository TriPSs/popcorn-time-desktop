/**
 * Created by tycho on 10/07/2017.
 */
import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'reactstrap'

import type { Props } from './SeasonsTypes'
import classes from './Seasons.scss'

export class Seasons extends React.Component {

  props: Props

  constructor(props) {
    super(props)

    this.state = {
      tooltips: [],
    }
  }

  toggleMagnetTooltip = (episode) => {
    const { tooltips } = this.state

    tooltips[episode] = !tooltips[episode]

    this.setState({
      tooltips,
    })
  }

  getBetTorrent = (torrents) => {
    let bestTorrent = null

    Object.keys(torrents).map(quality => {
      if (torrents[quality] !== null && (!bestTorrent || parseInt(bestTorrent) < parseInt(quality))) {
        bestTorrent = quality
      }
    })

    if (bestTorrent) {
      return torrents[bestTorrent]
    }

    return {
      health: {
        color: 'black',
      },
    }
  }

  render() {
    const { seasons, selectedSeason, selectedEpisode, selectSeasonAndEpisode } = this.props
    const { tooltips }                                                         = this.state

    return (
      <div className={'col-sm-12'}>
        <div className={classNames('col-sm-6', classes.seasons)}>
          <div className={classes.seasons__list}>
            {seasons.map(season =>
              <a
                className={classNames(classes['list-item'], {
                  [classes['list-item--active']]: season.number === selectedSeason,
                })}
                key={season.number}
                onClick={() => selectSeasonAndEpisode(season.number, 1)}
              >
                <div className={classes['list-item__text']}>
                  {season.title}
                </div>
              </a>
            )}
          </div>
        </div>

        <div className={classNames('col-sm-6', classes.seasons)}>
          <div className={classes.seasons__list}>
            {seasons[selectedSeason].episodes.map(episode =>
              <a
                className={classNames(classes['list-item'], {
                  [classes['list-item--active']]: episode.number === selectedEpisode,
                })}
                key={episode.number}
                onClick={() => selectSeasonAndEpisode(selectedSeason, episode.number)}
              >
                <div className={classes['list-item__text']}>
                  {episode.number}. {episode.title}
                </div>

                <div
                  id={`episode-${episode.number}`}
                  className={classes['list-item__health']}>

                  <div
                    className={classes['list-item__health-status']}
                    style={{ backgroundColor: episode.torrents['480p']
                      ? episode.torrents['480p'].health.color
                      : 'black' }} />

                  <div
                    className={classes['list-item__health-status']}
                    style={{ backgroundColor: episode.torrents['720p']
                      ? episode.torrents['720p'].health.color
                      : 'black' }} />
                  <div
                    className={classes['list-item__health-status']}
                    style={{ backgroundColor: episode.torrents['1080p']
                      ? episode.torrents['1080p'].health.color
                      : 'black' }} />

                  <Tooltip
                    placement={'top'}
                    isOpen={tooltips[episode.number]}
                    target={`episode-${episode.number}`}
                    toggle={() => this.toggleMagnetTooltip(episode.number)}>
                    <div>{`480p: ${episode.torrents['480p'] ? episode.torrents['480p'].seeds : 0} seeders`}</div>
                    <div>{`720p: ${episode.torrents['720p'] ? episode.torrents['720p'].seeds : 0} seeders`}</div>
                    <div>{`1080p: ${episode.torrents['1080p'] ? episode.torrents['1080p'].seeds : 0} seeders`}</div>
                  </Tooltip>
                </div>

              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Seasons
