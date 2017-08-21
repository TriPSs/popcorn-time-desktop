import React from 'react'

import type { Props } from './EpisodesTypes'
import Episode from './Episode'

export default class extends React.Component {

  props: Props

  activeEpisodeComponentRef

  componentWillReceiveProps(nextProps) {
    const { episodesListComponent: oldEpisodesListComponent } = this.props
    const { episodesListComponent: newEpisodesListComponent } = nextProps

    if (!oldEpisodesListComponent && newEpisodesListComponent) {
      newEpisodesListComponent.scrollLeft = (
        this.activeEpisodeComponentRef.offsetLeft - this.activeEpisodeComponentRef.offsetWidth
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedSeason: { number: newSeason } } = this.props
    const { selectedSeason: { number: oldSeason } } = prevProps
    const { episodesListComponent }                 = this.props

    if ((newSeason !== oldSeason) && episodesListComponent) {
      episodesListComponent.scrollLeft = (
        this.activeEpisodeComponentRef.offsetLeft - this.activeEpisodeComponentRef.offsetWidth
      )
    }
  }

  selectEpisode = ref => this.activeEpisodeComponentRef = ref

  render() {
    const { selectedSeason, selectedEpisode } = this.props
    const { selectSeasonAndEpisode }          = this.props

    return (
      <div className={'list'}>
        {selectedSeason.episodes.map(episode => (
          <Episode
            key={episode.number}
            {...{
              episode,
              selectedEpisode,
              selectSeasonAndEpisode,
              selectEpisode: this.selectEpisode,
            }} />
        ))}
      </div>
    )
  }
}

