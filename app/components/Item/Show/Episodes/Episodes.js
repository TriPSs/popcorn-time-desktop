import React from 'react'

import type { Props } from './EpisodesTypes'
import Episode from './Episode'

export default class extends React.Component {

  props: Props

  activeEpisodeComponent

  componentWillReceiveProps(nextProps) {
    const { episodesListComponent: oldEpisodesListComponent } = this.props
    const { episodesListComponent: newEpisodesListComponent } = nextProps

    if (!oldEpisodesListComponent && newEpisodesListComponent) {
      newEpisodesListComponent.scrollLeft = (
        this.activeEpisodeComponent.offsetLeft - this.activeEpisodeComponent.offsetWidth
      )
    }

    const { selectedEpisode: { id: newId, watched: newWatched } } = nextProps
    const { selectedEpisode: { id: oldId, watched: oldWatched } } = this.props

    // When marked watched, select the next unwatched episode
    if (newId === oldId && newWatched.complete && !oldWatched.complete) {
      const { selectSeasonAndEpisode } = this.props

      selectSeasonAndEpisode(nextProps.selectedEpisode.season)
    }
  }

  setSelectedEpisodeRef = ref => this.activeEpisodeComponent = ref

  componentDidUpdate(prevProps) {
    const { selectedSeason: newSelectedSeason } = this.props
    const { selectedSeason: oldSelectedSeason } = prevProps
    const { episodesListComponent }             = this.props

    if (newSelectedSeason !== oldSelectedSeason && episodesListComponent) {
      episodesListComponent.scrollLeft = (
        this.activeEpisodeComponent.offsetLeft - this.activeEpisodeComponent.offsetWidth
      )
    }
  }

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
              setSelectedEpisodeRef: this.setSelectedEpisodeRef,
            }} />
        ))}
      </div>
    )
  }
}

