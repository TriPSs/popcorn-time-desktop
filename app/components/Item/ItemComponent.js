import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import debug from 'debug'

import Torrent from 'api/Torrent'
import Player from 'components/Player'
import type { Props, State } from './ItemTypes'
import Background from './Background'
import Info from './Info'
import classes from './Item.scss'

const log = debug('app:item')

export default class Item extends React.Component {

  props: Props

  torrent: Torrent

  state: State = {
    torrent: null,
  }

//  playerProvider: ChromecastPlayerProvider

  constructor(props: Props) {
    super(props)

    this.torrent = new Torrent()

//    this.playerProvider = new ChromecastPlayerProvider()

    // this.subtitleServer = startSubtitleServer()
  }

  static defaultProps: Props

  /**
   * Check which players are available on the system
   */
  play = (playerType) => {
    switch (playerType) {
      case 'youtube':
        const { item, player } = this.props

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
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    this.getAllData()
    // this.initCastingDevices()
    this.stopPlayback()
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

    } else if (!isLoading && wasLoading) {
      this.getBestTorrent(nextProps)
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
    // MediaPlayer.destroy()
    // this.torrent.destroy()
    // this.setState({ torrentInProgress: false })
  }

  render() {
    const { match: { params: { activeMode } } } = this.props
    const { item, isLoading }                   = this.props
    const { torrent }                           = this.state

    if (isLoading || item === null || !torrent) {
      return null
    }

    console.log(item)
    console.log('best torrent', torrent)

    return (
      <div className={classNames('container-fluid', classes.item)}>
        <Link to={'/'}>
          <button className={'btn btn-back'} onClick={this.stopPlayback}>
            Back
          </button>
        </Link>

        <Player />

        <Background
          {...{
            activeMode,
            torrent,
            torrents       : item.torrents,
            setTorrent     : this.setTorrent,
            backgroundImage: item.images.fanart.full,
            poster         : item.images.poster.thumb,
          }}>

          <Info
            {...{
              item,
              activeMode,
              play: this.play,
            }} />

        </Background>

      </div>
    )
  }
}

Item.defaultProps = {
  itemId    : '',
  activeMode: 'movies',
}
