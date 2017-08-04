import React from 'react'
import classNames from 'classnames'

import placeHolderImage from 'images/posterholder.png'
import type { Props } from './SeasonsTypes'

export default class extends React.Component {

  props: Props

  componentDidUpdate(prevProps) {
    const { seasonsListComponent: newSeasonsListComponent } = this.props
    const { seasonsListComponent: oldSeasonsListComponent } = prevProps

    if (!oldSeasonsListComponent && newSeasonsListComponent) {
      newSeasonsListComponent.scrollLeft = (
        this.activeSeasonComponent.offsetLeft - this.activeSeasonComponent.offsetWidth
      )
    }
  }

  activeSeasonComponent

  render() {
    const { seasons, selectSeasonAndEpisode, selectedSeason } = this.props

    return (
      <div className={'list'}>
        {seasons.map(season => (
          <a
            role={'presentation'}
            ref={(ref) => {
              if (season.number === selectedSeason.number) {
                this.activeSeasonComponent = ref
              }
            }}
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
  }
}
