import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Events from 'api/Events'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'
import * as PlayerStatuses  from 'api/Player/PlayerStatuses'

import Player from 'components/Player'
import type { Props, State } from './ItemTypes'
import Background from './Background'
import Info from './Info'
import classes from './Item.scss'

export default class Item extends React.Component {

  static defaultProps: Props

  props: Props

  state: State = {
    torrent      : null,
    torrentStatus: TorrentStatuses.NONE,
  }

  constructor(props: Props) {
    super(props)

    // this.torrent = new Torrent()

//    this.playerProvider = new ChromecastPlayerProvider()

    // this.subtitleServer = startSubtitleServer()
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    this.getAllData()
    // this.initCastingDevices()
    this.stopPlayback()

    Events.on(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
  }

  torrentStatusChange = (event, data) => {
    const { newStatus } = data

    this.setState({
      torrentStatus: newStatus,
    })
  }

  componentWillUnmount() {
    this.stopPlayback()
  }

  componentWillReceiveProps(nextProps: Props) {
    const { isLoading: wasLoading, item: oldItem, match: { params: { itemId: oldItemId } } } = this.props
    const { isLoading, item: newItem, match: { params: { itemId: newItemId } } }             = nextProps

    if (newItemId !== oldItemId) {
      this.setState({
        torrent: null,
      })
      this.stopPlayback()

      this.getAllData()
      window.scrollTo(0, 0)

    } else if (!isLoading && wasLoading && newItem.type === 'movie') {
      this.getBestTorrent(nextProps)
    }
  }

  play = (playerType) => {
    const { item, player } = this.props

    switch (playerType) {
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
        const { torrent } = this.state

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
    const { getItem, match: { params: { itemId, activeMode } } } = this.props

    getItem(itemId, activeMode)
  }

  getBestTorrent = (props = this.props) => {
    const { torrent } = this.state

    if (torrent) {
      return torrent
    }

    const { item: { torrents } } = props

    let bestQuality = null
    Object.keys(torrents).map((quality) => {
      if (bestQuality === null || parseInt(bestQuality) < parseInt(quality)) {
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

  showInfo = () => {
    const { torrentStatus } = this.state
    const { playerStatus }  = this.props

    if (playerStatus === PlayerStatuses.PLAYING) {
      return false
    }

    return torrentStatus === TorrentStatuses.NONE
  }

  render() {
    const { match: { params: { activeMode } } } = this.props
    const { item, isLoading }                   = this.props
    const { torrent }                           = this.state

    if (isLoading || item === null) {
      return null
    }

    console.log(item)

    return (
      <div className={classNames('container-fluid', classes.item)}>
        <Link to={'/'}>
          <button
            style={{ zIndex: 1060 }}
            className={'btn btn-back'} onClick={this.stopPlayback}>
            Back
          </button>
        </Link>

        <Background
          {...{
            activeMode,
            torrent,
            torrents       : item.torrents,
            setTorrent     : this.setTorrent,
            play           : this.play,
            backgroundImage: item.images.fanart.full,
            poster         : item.images.poster.thumb,
            showPlayInfo   : this.showInfo(),
          }}>

          {this.showInfo() && (
            <Info
              {...{
                item,
                activeMode,
                play: this.play,
              }} />
          )}

          <Player item={item} />

        </Background>

      </div>
    )
  }
}

Item.defaultProps = {
  itemId    : '',
  activeMode: 'movies',
}
