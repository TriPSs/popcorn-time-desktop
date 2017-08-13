import React from 'react'

import type { SeasonType, EpisodeType } from 'api/Metadata/MetadataTypes'

import type { Props } from './ShowTypes'
import itemClasses from '../Item.scss'
import Seasons from './Seasons'
import Episodes from './Episodes'
import classes from './Show.scss'

export default class extends React.Component {

  props: Props

  state = {
    seasonsListComponent : null,
    episodesListComponent: null,
  }

  constructor(props) {
    super(props)

    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    this.tomorrow = tomorrowDate.getTime()
  }

  componentWillUnmount() {
    const { selectSeasonAndEpisode } = this.props

    selectSeasonAndEpisode(null, null)
  }

  tomorrow: number

  getSeason = (selectedSeason = this.props.selectedSeason): SeasonType => {
    const { item } = this.props

    if (!item.seasons || !item.seasons.length) {
      return null
    }

    if (selectedSeason !== null) {
      return item.seasons.find(season => season.number === selectedSeason)
    }

    let firstUnwatchedSeason = item.seasons.find(season =>
      season.number !== 0 && season.episodes.find(episode => !episode.watched.complete))

    if (!firstUnwatchedSeason) {
      firstUnwatchedSeason = item.seasons.find(season =>
        season.number === item.seasons.length - 1)
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

    const firstUnwatchedEpisode = searchInSeason.episodes.find(episode => !episode.watched.complete)
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
    const { item, selectSeasonAndEpisode } = this.props
    const season                           = this.getSeason()

    let selectedEpisode = this.getEpisode()
    if (!selectedEpisode) {
      selectedEpisode = this.getFirstUnwatchedEpisode()
    }

    const { seasonsListComponent, episodesListComponent } = this.state

    return (
      <div className={itemClasses['item__row--show']}>
        <div className={classes.show}>
          <div
            ref={ref => !this.state.seasonsListComponent && this.setState({ seasonsListComponent: ref })}
            className={classes['show__list-container']}>
            <Seasons {...{
              seasons       : item.seasons,
              selectedSeason: season,
              selectSeasonAndEpisode,
              seasonsListComponent,
            }} />
          </div>

          <div
            ref={ref => !this.state.episodesListComponent && this.setState({ episodesListComponent: ref })}
            className={classes['show__list-container']}>
            <Episodes {...{
              selectedEpisode,
              selectedSeason: season,
              selectSeasonAndEpisode,
              episodesListComponent,
            }} />
          </div>
        </div>
      </div>
    )
  }
}
