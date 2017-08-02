import React from 'react'

import type { SeasonType, EpisodeType } from 'api/Metadata/MetadataTypes'

import type { Props } from './ShowTypes'
import itemClasses from '../Item.scss'
import Seasons from './Seasons'
import Episodes from './Episodes'
import classes from './Show.scss'

export class Show extends React.Component {

  props: Props

  tomorrow: number

  constructor(props) {
    super(props)

    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    this.tomorrow = tomorrowDate.getTime()
  }

  componentWillReceiveProps(nextProps) {
    const { selectedSeason: newSelectedSeason, selectedEpisode: newSelectedEpisode } = nextProps
    const { selectedSeason: wasSelectedSeason, selectedEpisode: wasSelectedEpisode } = this.props

    if (newSelectedSeason !== wasSelectedSeason || newSelectedEpisode !== wasSelectedEpisode) {
      const { setBestTorrent } = this.props

      setBestTorrent(this.getEpisode().torrents)
    }
  }

  selectSeasonAndEpisode = (selectSeason, selectEpisode = null) => {
    let episodeToSelect = selectEpisode
    if (episodeToSelect === null) {
      const season                = this.getSeason(selectSeason)
      const firstUnwatchedEpisode = this.getFirstUnwatchedEpisode(season)

      if (firstUnwatchedEpisode) {
        episodeToSelect = firstUnwatchedEpisode.number
      } else {
        episodeToSelect = 1
      }
    }

    const { selectSeasonAndEpisode } = this.props
    selectSeasonAndEpisode(selectSeason, episodeToSelect)
  }

  getSeason = (selectedSeason = this.props.selectedSeason): SeasonType => {
    const { item } = this.props

    if (!item.seasons || !item.seasons.length) {
      return null
    }

    if (selectedSeason !== null) {
      return item.seasons.find(season => season.number === selectedSeason)
    }

    let firstUnwatchedSeason = item.seasons.find(season => season.number !== 0
                                                           && season.episodes.find(episode => !episode.watched))

    if (!firstUnwatchedSeason) {
      firstUnwatchedSeason = item.seasons.find(season => season.number === item.seasons.length - 1)
    }

    return firstUnwatchedSeason
  }

  getEpisode = (selectedEpisode = this.props.selectedEpisode): EpisodeType => {
    const season = this.getSeason()

    if (!season || !season.episodes) {
      return null
    }

    if (selectedEpisode !== null) {
      return season.episodes.find(episode => episode.number === selectedEpisode && episode.aired < this.tomorrow)
    }

    return this.getFirstUnwatchedEpisode()
  }

  getFirstUnwatchedEpisode = (season = null): EpisodeType => {
    let searchInSeason = season

    if (searchInSeason === null) {
      searchInSeason = this.getSeason()
    }

    const firstUnwatchedEpisode = searchInSeason.episodes.find(episode => !episode.watched)
    if (firstUnwatchedEpisode) {
      if (firstUnwatchedEpisode.aired < this.tomorrow) {
        return firstUnwatchedEpisode
      }

      return searchInSeason.episodes.find(
        episode => episode.number === (firstUnwatchedEpisode.number - 1),
      )
    }

    return searchInSeason.episodes.find(
      episode => episode.number === searchInSeason.episodes.length,
    )
  }

  render() {
    const { item } = this.props
    const season   = this.getSeason()

    let selectedEpisode = this.getEpisode()
    if (!selectedEpisode) {
      selectedEpisode = this.getFirstUnwatchedEpisode()
    }

    return (
      <div className={itemClasses['item__row--show']}>
        <div className={classes.show}>
          <div className={classes['show__list-container']}>
            <Seasons {...{
              seasons               : item.seasons,
              selectedSeason        : season,
              selectSeasonAndEpisode: this.selectSeasonAndEpisode,
            }} />
          </div>

          <div className={classes['show__list-container']}>
            <Episodes {...{
              selectedEpisode,
              selectedSeason        : season,
              selectSeasonAndEpisode: this.selectSeasonAndEpisode,
            }} />
          </div>
        </div>
      </div>
    )
  }
}

export default Show

