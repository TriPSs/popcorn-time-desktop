import React from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import * as PlayerConstants from 'api/Player/PlayerConstants'
import * as TorrentConstants from 'api/Torrent/TorrentConstants'
import { getHighestQualtity } from 'api/Torrents/TorrentsHelpers'
import Watched from 'components/Watched'
import Loader from 'components/Loader'
import placeHolderImage from 'images/posterholder.png'
import type { Props, State } from './EpisodeTypes'

export default class extends React.Component {

  props: Props

  state: State = {
    torrent: null,
  }

  constructor(props) {
    super(props)

    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    this.tomorrow = tomorrowDate.getTime()
  }

  componentWillMount() {
    this.setBestTorrent()
  }

  componentWillReceiveProps(nextProps) {
    const { fetchingEpisodeTorrents: isSearchingTorrents, episode: { id: oldId } }  = nextProps
    const { fetchingEpisodeTorrents: wasSearchingTorrents, episode: { id: newId } } = this.props

    if ((oldId !== newId) || (!isSearchingTorrents && wasSearchingTorrents)) {
      this.setBestTorrent(nextProps)
    }
  }

  handleOnPlayIconClick = () => {
    const { episode, item, player } = this.props
    const { selectedEpisode }       = this.props
    const { torrent }               = this.state

    if (selectedEpisode.number === episode.number) {
      if (torrent) {
        player.play(torrent.url, { ...item, ...episode })

      } else {
        this.handleSearchTorrents()
      }
    }
  }

  handleSearchTorrents = () => {
    const { item, episode, itemActions } = this.props
    const { fetchingEpisodeTorrents }    = this.props

    if (!fetchingEpisodeTorrents) {
      itemActions.searchEpisodeTorrents(item, episode.season, episode.number)
    }
  }

  setBestTorrent = (props = this.props) => {
    const { episode: { torrents } } = props

    this.setState({
      torrent: getHighestQualtity(torrents),
    })
  }

  selectTorrent = (quality) => {
    const { episode: { torrents, number } } = this.props
    const { selectedEpisode }               = this.props

    if (selectedEpisode.number === number) {
      this.setState({
        torrent: torrents[quality],
      })
    }
  }

  tomorrow: number

  hidePlay = () => {
    const { fetchingEpisodeTorrents, episode } = this.props
    const { playerStatus, torrentStatus }      = this.props
    const { torrent }                          = this.state

    return playerStatus !== PlayerConstants.STATUS_NONE ||
           torrentStatus !== TorrentConstants.STATUS_NONE ||
           (fetchingEpisodeTorrents || (episode.searched && !torrent))
  }

  getFormattedAired = (aired: number) => {
    const date = new Date(aired)

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getYear()}`
  }

  render() {
    const { episode, setSelectedEpisodeRef }          = this.props
    const { selectSeasonAndEpisode, selectedEpisode } = this.props
    const { fetchingEpisodeTorrents }                 = this.props

    const { torrent } = this.state

    return (
      <a
        role={'presentation'}
        ref={(ref) => {
          if (episode.number === selectedEpisode.number) {
            setSelectedEpisodeRef(ref)
          }
        }}
        className={classNames('list__item--hor',
          {
            'list__item--active' : episode.number === selectedEpisode.number,
            'list__item--watched': episode.watched.complete && episode.number !== selectedEpisode.number,
          }, episode.aired > this.tomorrow
            ? 'list__item--disabled'
            : 'list__item--available',
        )}
        key={episode.number}
        onClick={() => (episode.aired < this.tomorrow
          ? selectSeasonAndEpisode(selectedEpisode.season, episode.number)
          : null)}
      >
        <div className={'list__item-image-container--hor'}>
          <img
            className={classNames(
              'list__item-image',
              { 'animated fadeIn': !!episode.images },
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
              tooltip={{ place: 'left', effect: 'float' }}
              className={'list__item-watched'}
              item={episode} />
          )}

          <div
            data-tip
            data-for={`${episode.id}-search-tooltip`}
            role={'presentation'}
            onClick={this.handleSearchTorrents}
            className={classNames('list__item-search', {
              gone: this.hidePlay() || episode.searched,
            })}>

            <i className={'ion-search'} />

            <ReactTooltip place={'right'} id={`${episode.id}-search-tooltip`} effect={'float'}>
              Search for (better)torrents
            </ReactTooltip>

          </div>

          <div
            data-tip
            data-for={`${episode.id}-play-tooltip`}
            role={'presentation'}
            onClick={this.handleOnPlayIconClick}
            className={classNames('list__item-play', {
              gone: this.hidePlay(),
            })}>

            <i className={classNames({
              'ion-ios-play': torrent,
              'ion-search'  : !torrent,
            })} />

            <ReactTooltip id={`${episode.id}-play-tooltip`} effect={'float'}>
              {torrent ? `Play in ${torrent.quality}` : 'Search for torrents'}
            </ReactTooltip>

          </div>

          <div className={classNames('list__item-qualities', {
            gone: this.hidePlay(),
          })}>
            {Object.keys(episode.torrents).map(quality => (
              <div
                role={'presentation'}
                key={quality}
                className={classNames(
                  'list__item-quality',
                  {
                    'list__item-quality--active'   : torrent && torrent.quality === quality,
                    'list__item-quality--available': episode.torrents[quality],
                  },
                )}
                onClick={() => this.selectTorrent(quality)}>
                {quality}
              </div>
            ))}
          </div>

          {!torrent && episode.searched && (
            <div style={{ position: 'absolute' }}>
              No torrents found...
            </div>
          )}

          {episode.watched.progress && !episode.watched.complete && (
            <div className={'list__item-progress'}>
              <div style={{ width: `${episode.watched.progress}%` }} />
            </div>
          )}

          <Loader className={'list__item-loader'} isLoading={fetchingEpisodeTorrents} inListItem />

        </div>

        <div className={'list__item-title'}>
          {episode.title ? episode.title : `Episode ${episode.number}`}
        </div>

        <div className={'list__item-summary'}>
          {episode.summary}
        </div>
      </a>
    )
  }
}

