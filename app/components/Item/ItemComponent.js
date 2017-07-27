import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Events from 'api/Events'
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

  state: State = {
    torrent: null,
  }

  componentWillMount() {
    this.getAllData()
  }

  componentDidMount() {
    window.scrollTo(0, 0)

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
  }

  play = (playerProvider, torrent = this.state.torrent) => {
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

  getAllData = () => {
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

  render() {
    const { match: { params: { itemId, mode } } } = this.props
    const { item, isLoading, toggleWatched }      = this.props
    const { torrentStatus }                       = this.props
    const { torrent }                             = this.state

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
          <div className={classNames(classes[`item__row--${mode}`], classes[`item__main--${mode}`])}>
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
            <Show
              {...{
                toggleWatched,
                torrentStatus,
                play: this.play,
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
