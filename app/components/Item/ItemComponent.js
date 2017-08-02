import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as TorrentConstants from 'api/Torrent/TorrentConstants'
import * as PlayerConstants from 'api/Player/PlayerConstants'

import Loader from 'components/Loader'
import Player from 'components/Player'
import type { Props, State } from './ItemTypes'
import Background from './Background'
import Info from './Info'
import Cover from './Cover'
import Show from './Show'
import classes from './Item.scss'

export default class Item extends React.Component {

  static defaultProps: Props

  props: Props

  componentWillMount() {
    this.getAllData()
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    const { item } = this.props
    if (item) {
      this.setBestTorrent(this.getTorrents())
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { isLoading: wasLoading, match: { params: { itemId: oldItemId } } } = this.props
    const { isLoading, item, match: { params: { itemId: newItemId } } }       = nextProps

    const { torrent: oldTorrent } = this.props
    const { torrent: newTorrent } = nextProps

    if (newItemId !== oldItemId) {
      this.getAllData()
      window.scrollTo(0, 0)
    }

    if (((!isLoading && wasLoading) || (!oldTorrent && !newTorrent)) && item) {
      this.setBestTorrent(this.getTorrents(nextProps))
    }
  }

  componentWillUnmount() {
    const { setTorrent } = this.props
    this.stopPlayback()

    setTorrent(null)
  }

  play = (playerProvider, torrent = this.props.torrent) => {
    const { item, player } = this.props

    switch (playerProvider) {
      case 'youtube':
        player.play(item.trailer, {
          title: item.title,
          type : 'youtube',
          image: {
            poster: item.images.poster.medium,
          },
        })

        break

      default:
        player.play(torrent.url, item)
    }
  }

  setBestTorrent = (torrents = this.props.item.torrents) => {
    if (!torrents) {
      return null
    }

    let bestQuality = null

    Object.keys(torrents).map((quality) => {
      if (bestQuality === null || parseInt(bestQuality, 10) < parseInt(quality, 10)) {
        if (torrents[quality] !== null) {
          bestQuality = quality
        }
      }
    })

    const { setTorrent } = this.props
    setTorrent(bestQuality ? torrents[bestQuality] : null)
  }

  stopPlayback = () => {
    const { player, playerStatus } = this.props

    if (playerStatus !== PlayerConstants.STATUS_NONE) {
      player.stop()
    }
  }

  showPlayInfo = () => {
    const { playerStatus, torrentStatus } = this.props

    if (playerStatus === PlayerConstants.STATUS_PLAYING) {
      return false
    }

    return torrentStatus === TorrentConstants.STATUS_NONE
  }

  getAllData = () => {
    const { player, getItem, match: { params: { itemId, mode } } } = this.props

    getItem(itemId, mode)
    player.getDevices()
  }

  getTorrents = (props = this.props) => {
    const { item } = props

    if (item.type === MetadataConstants.TYPE_MOVIE) {
      return item.torrents

    } else {
      const { selectedSeason: selectedSeasonNr, selectedEpisode: selectedEpisodeNr } = this.props

      const selectedSeason = item.seasons.find(season => season.number === selectedSeasonNr)

      if (selectedSeason) {
        const selectedEpisode = selectedSeason.episodes.find(episode => episode.number === selectedEpisodeNr)

        if (selectedEpisode) {
          return selectedEpisode.torrents
        }
      }
    }

    return {
      '1080p': null,
      '720p' : null,
      '480p' : null,
    }
  }

  render() {
    const { match: { params: { itemId, mode } } } = this.props
    const { item, isLoading, torrentStatus }      = this.props
    const { setTorrent, torrent }                 = this.props

    if (isLoading || !item || item.id !== itemId) {
      return <Loader {...{ isLoading }} />
    }

    return (
      <div className={classNames('container-fluid', classes.item)}>
        <Link to={`/${mode}s`}>
          <button
            style={{ zIndex: 1060 }}
            className={'pct-btn pct-btn-trans pct-btn-outline pct-btn-round'}
            onClick={this.stopPlayback}>
            <i className={'ion-ios-arrow-back'} />
            Back
          </button>
        </Link>

        <Background
          {...{
            backgroundImage: item.images.fanart.high,
          }} />

        <div className={classes[`item__content--${mode}`]}>
          <div className={classNames(classes[`item__row--${mode}`], classes[`item__main--${mode}`])}>
            <Cover {...{
              mode,
              setTorrent,
              torrent,
              torrents       : this.getTorrents(),
              play           : this.play,
              backgroundImage: item.images.fanart.high,
              poster         : item.images.poster.thumb,
              showPlayInfo   : this.showPlayInfo(),
            }} />

            {this.showPlayInfo() && (
              <Info
                {...{
                  item,
                  mode,
                  play: this.play,
                }} />
            )}

            <Player item={item} />
          </div>

          {item.type === 'show' && (
            <Show
              {...{
                torrentStatus,
                play          : this.play,
                setBestTorrent: this.setBestTorrent,
              }} />
          )}

        </div>
      </div>
    )
  }
}

Item.defaultProps = {
  itemId: '',
  mode  : 'movie',
}
