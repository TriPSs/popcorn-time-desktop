import React from 'react'
import classNames from 'classnames'

import Watched from 'components/Watched'
import placeHolderImage from 'images/posterholder.png'
import type { Props } from './EpisodesTypes'

export default class extends React.Component {

  props: Props

  constructor(props) {
    super(props)

    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    this.tomorrow = tomorrowDate.getTime()
  }

  tomorrow: number

  activeEpisodeComponent

  componentWillReceiveProps(nextProps) {
    const { episodesListComponent: oldEpisodesListComponent } = this.props
    const { episodesListComponent: newEpisodesListComponent } = nextProps

    if (!oldEpisodesListComponent && newEpisodesListComponent) {
      newEpisodesListComponent.scrollLeft = (
        this.activeEpisodeComponent.offsetLeft - this.activeEpisodeComponent.offsetWidth
      )
    }
  }

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

  getFormattedAired = (aired: number) => {
    const date = new Date(aired)

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getYear()}`
  }

  render() {
    const { selectedSeason, selectedEpisode } = this.props
    const { selectSeasonAndEpisode }          = this.props

    return (
      <div className={'list'}>
        {selectedSeason.episodes.map(episode => (
          <a
            ref={(ref) => {
              if (episode.number === selectedEpisode.number) {
                this.activeEpisodeComponent = ref
              }
            }}
            className={classNames('list__item--hor',
              {
                'list__item--active' : episode.number === selectedEpisode.number,
                'list__item--watched': episode.watched && episode.number !== selectedEpisode.number,
              }, episode.aired > this.tomorrow
                ? 'list__item--disabled'
                : 'list__item--available',
            )}
            key={episode.number}
            onClick={() => episode.aired < this.tomorrow
              ? selectSeasonAndEpisode(selectedSeason.number, episode.number)
              : null}
          >
            <div className={'list__item-image-container--hor'}>
              <img
                className={classNames(
                  'animated fadeIn',
                  'list__item-image',
                  { 'list__item-image-placeholder': !episode.images },
                )}
                src={episode.images ? episode.images.poster.thumb : placeHolderImage}
                alt={episode.title} />

              <div className={'list__item-overlay'} />

              {episode.aired > this.tomorrow && (
                <div className={'list__item-overlay-text'}>
                  {this.getFormattedAired(episode.aired)}
                </div>
              )}

              {episode.aired < this.tomorrow && (
                <Watched
                  className={'list__item-watched'}
                  item={episode} />
              )}

              <div className={'list__item-play'}>
                <i className={'ion-ios-play'} />
              </div>

              <div className={'list__item-qualities'}>
                {Object.keys(episode.torrents).map(quality => (
                  <div
                    key={quality}
                    className={classNames(
                      'list__item-quality',
                      { 'list__item-quality--active': quality === '480p' }
                    )}>
                    {quality}
                  </div>
                ))}
              </div>

            </div>

            <div className={'list__item-title'}>
              {episode.title ? episode.title : `Episode ${episode.number}`}
            </div>

            <div className={'list__item-summary'}>
              {episode.summary}
            </div>
          </a>
        ))}
      </div>
    )
  }
}

