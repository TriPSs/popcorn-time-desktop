import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Events from 'api/Events'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'
import * as PlayerStatuses  from 'api/Player/PlayerStatuses'

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

  state: State = {
    torrent      : null,
    torrentStatus: TorrentStatuses.NONE,
  }

  componentWillMount() {
    this.getAllData()
    this.stopPlayback()
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    Events.on(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)

    const { item } = this.props
    if (item && item.type === MetadataConstants.TYPE_MOVIE) {
      this.getBestMovieTorrent()
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { isLoading: wasLoading, match: { params: { itemId: oldItemId } } } = this.props
    const { isLoading, item, match: { params: { itemId: newItemId } } }       = nextProps

    if (newItemId !== oldItemId) {
      this.setState({
        torrent: null,
      })
      this.stopPlayback()

      this.getAllData()
      window.scrollTo(0, 0)

    } else if (!isLoading && wasLoading && item.type === MetadataConstants.TYPE_MOVIE) {
      this.getBestMovieTorrent(nextProps)
    }
  }

  componentWillUnmount() {
    this.stopPlayback()

    Events.remove(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
  }

  torrentStatusChange = (event, data) => {
    const { newStatus } = data

    this.setState({
      torrentStatus: newStatus,
    })
  }

  play = (playerProvider, torrent = this.state.torrent) => {
    const { item, player } = this.props

    switch (playerProvider) {
      case 'youtube':
        player.play(item.trailer, {
          title   : item.title,
          type    : 'youtube',
          image   : {
            poster: item.images.poster.medium,
          },
          autoPlay: true,
        })

        break

      default:
        player.play(torrent.url, {
          title   : item.title,
          image   : {
            poster: item.images.poster.medium,
          },
          autoPlay: true,
        })
    }
  }

  getAllData() {
    const { player, getItem, match: { params: { itemId, mode } } } = this.props

    getItem(itemId, mode)
    player.getDevices()
  }

  getBestMovieTorrent = (props = this.props) => {
    const { torrent } = this.state

    if (torrent) {
      return torrent
    }

    const { item: { torrents } } = props

    let bestQuality = null
    Object.keys(torrents).map((quality) => {
      if (bestQuality === null || parseInt(bestQuality, 10) < parseInt(quality, 10)) {
        bestQuality = quality
      }
    })

    this.setTorrent(torrents[bestQuality])

    return torrents[bestQuality]
  }

  setTorrent = (torrent) => {
    this.setState({
      torrent,
    })
  }

  stopPlayback = () => {
    const { player } = this.props

    player.stop()
  }

  showPlayInfo = () => {
    const { torrentStatus } = this.state
    const { playerStatus }  = this.props

    if (playerStatus === PlayerStatuses.PLAYING) {
      return false
    }

    return torrentStatus === TorrentStatuses.NONE
  }

  render() {
    const { match: { params: { itemId, mode } } } = this.props
    const { item, isLoading }                     = this.props
    const { torrent, torrentStatus }              = this.state

    if (isLoading || !item || item.id !== itemId) {
      return <Loader />
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
          <div className={classes[`item__row--${mode}`]}>
            <Cover {...{
              mode,
              torrent,
              torrents       : item.torrents,
              setTorrent     : this.setTorrent,
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
            <Show torrentStatus={torrentStatus} play={this.play} />
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
