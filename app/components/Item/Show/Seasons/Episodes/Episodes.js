/**
 * Created by tycho on 10/07/2017.
 */
import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'reactstrap'

import type { Props, State } from './EpisodesTypes'

export class Episodes extends React.Component {

  props: Props

  state: State = {
    tooltips: [],
  }

  toggleMagnetTooltip = (episode) => {
    const { tooltips } = this.state

    tooltips[episode] = !tooltips[episode]

    this.setState({
      tooltips,
    })
  }

  render() {
    const { selectedSeason, selectedEpisode } = this.props
    const { selectSeasonAndEpisode }          = this.props
    const { tooltips }                        = this.state

    const today = new Date().getTime()

    return (
      <div className={'list'}>
        {selectedSeason.episodes.map(episode =>
          <a
            className={classNames('list-item', {
              'list-item--active'  : episode.number === selectedEpisode.number,
              'list-item--disabled': episode.aired > today,
            })}
            key={episode.number}
            onClick={() => {
              if (episode.aired < today) {
                selectSeasonAndEpisode(selectedSeason.number, episode.number)
              }
            }}
          >
            <div className={'list-item__text'}>
              {episode.number}. {episode.title}
            </div>

            <div
              id={`episode-${episode.number}`}
              className={'list-item__health'}>

              {Object.keys(episode.torrents).map(quality => (
                <div
                  className={'list-item__health-status'}
                  style={{
                    backgroundColor: episode.torrents[quality]
                      ? episode.torrents[quality].health.color
                      : 'black',
                  }} />
              ))}

              {episode.aired < today && (
                <Tooltip
                  placement={'top'}
                  isOpen={tooltips[episode.number]}
                  target={`episode-${episode.number}`}
                  toggle={() => this.toggleMagnetTooltip(episode.number)}>
                  <div>{`480p: ${episode.torrents['480p'] ? episode.torrents['480p'].seeds : 0} seeders`}</div>
                  <div>{`720p: ${episode.torrents['720p'] ? episode.torrents['720p'].seeds : 0} seeders`}</div>
                  <div>{`1080p: ${episode.torrents['1080p'] ? episode.torrents['1080p'].seeds : 0} seeders`}</div>
                </Tooltip>
              )}
            </div>
          </a>
        )}
      </div>
    )
  }
}

export default Episodes