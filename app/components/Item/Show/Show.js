import React from 'react'
import classNames from 'classnames'

import type { State, Props } from './ShowTypes'
import itemClasses from '../Item.scss'
import classes from './Show.scss'
import Seasons from './Seasons'

export class Show extends React.Component {

  props: Props

  state: State = {
    selectedSeason : 1,
    selectedEpisode: 1,
  }

  playEpisode = (torrent) => {
    if (torrent !== null) {
      const { play } = this.props

      play('default', torrent)

    } else {
      const { item, searchEpisodeTorrents } = this.props
      const season                          = this.getSeason()
      const episode                         = this.getEpisode()

      if (!episode.searched) {
        searchEpisodeTorrents(item, season.number, episode.number)
      }
    }
  }

  selectSeasonAndEpisode = (season, episode) => this.setState({
    selectedSeason : season,
    selectedEpisode: episode,
  })

  getSeason = () => {
    const { item }           = this.props
    const { selectedSeason } = this.state

    if (!item.seasons) {
      return null
    }

    return item.seasons.find(season => season.number === selectedSeason)
  }

  getEpisode = () => {
    const { selectedEpisode } = this.state
    const season              = this.getSeason()

    if (!season || !season.episodes) {
      return null
    }

    return season.episodes.find(episode => episode.number === selectedEpisode)
  }

  render() {
    const { item, fetchingEpisodeTorrents } = this.props
    const season                            = this.getSeason()
    const episode                           = this.getEpisode()
    const { torrents, searched }            = episode

    return (
      <div>
        <div className={classNames(itemClasses['item__row--show'], classes.show__actions)}>

          {torrents && Object.keys(torrents).map(quality => (
            <button
              key={quality}
              style={{ zIndex: 1060 }}
              onClick={() => !fetchingEpisodeTorrents ? this.playEpisode(torrents[quality]) : null}
              className={classNames(
                'pct-btn pct-btn-trans pct-btn-outline pct-btn-round',
                { 'pct-btn-available': torrents[quality] !== null },
                { 'pct-btn-no-hover': fetchingEpisodeTorrents },
                { 'pct-btn-no-hover': torrents[quality] === null && searched },
              )}>

              {torrents[quality] !== null && !fetchingEpisodeTorrents && (
                <div>Play in {quality}</div>
              )}

              {torrents[quality] === null && !fetchingEpisodeTorrents && (
                <div>{(searched ? 'Did not found ' : 'Search for ') + quality}</div>
              )}

              {fetchingEpisodeTorrents && (
                <div>Searching for {quality}...</div>
              )}
            </button>
          ))}

        </div>

        <div className={itemClasses['item__row--show']}>
          <Seasons {...{
            seasons               : item.seasons,
            selectedSeason        : season,
            selectedEpisode       : episode,
            selectSeasonAndEpisode: this.selectSeasonAndEpisode,
          }} />

        </div>
      </div>
    )
  }
}

export default Show
