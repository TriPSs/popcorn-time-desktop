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
import Cover from './Cover'
import Seasons from './Seasons'
import classes from './Item.scss'

export default class Item extends React.Component {

  static defaultProps: Props

  props: Props

  state: State = {
    torrent        : null,
    torrentStatus  : TorrentStatuses.NONE,
    selectedSeason : 1,
    selectedEpisode: 1,
  }

  constructor(props: Props) {
    super(props)

    // this.torrent = new Torrent()

//    this.playerProvider = new ChromecastPlayerProvider()

    // this.subtitleServer = startSubtitleServer()
  }

  componentWillMount() {
    const { getItem, match: { params: { itemId, activeMode } } } = this.props

    this.getAllData()
    // this.initCastingDevices()
    this.stopPlayback()
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    Events.on(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
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
      this.getBestMovieTorrent(nextProps)
    }
  }

  componentWillUnmount() {
    this.stopPlayback()
  }

  torrentStatusChange = (event, data) => {
    const { newStatus } = data

    this.setState({
      torrentStatus: newStatus,
    })
  }

  playEpisode = (torrent) => {
    if (torrent !== null) {
      this.setTorrent('plyr', torrent)

    } else {
      // TODO:: Search
    }
  }

  play = (playerType, torrent = this.state.torrent) => {
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

  selectSeasonAndEpisode = (season, episode) => this.setState({
    selectedSeason : season,
    selectedEpisode: episode,
  })

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

  getSeason = () => {
    const { item }           = this.props
    const { selectedSeason } = this.state

    if (!item.seasons) {
      return null
    }

    return item.seasons.find(season => season.number === selectedSeason)
  }

  getEpisode = () => {
    const { selectedEpisode } = this.state
    const season              = this.getSeason()

    if (!season || !season.episodes) {
      return null
    }

    return season.episodes.find(episode => episode.number === selectedEpisode)
  }

  render() {
    const { match: { params: { itemId, activeMode } } } = this.props
    const { item, isLoading }                           = this.props
    const { torrent }                                   = this.state

    if (isLoading || item === null || item.id !== itemId) {
      return null
    }

    let torrents = {}
    if (activeMode === 'show') {
      const episode = this.getEpisode()
      torrents      = episode ? episode.torrents : {}
    }

    return (
      <div className={classNames('container-fluid', classes.item)}>
        <Link to={'/'}>
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

        <div className={classes[`item__content--${activeMode}`]}>
          <div className={classes[`item__row--${activeMode}`]}>
            <Cover {...{
              activeMode,
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
                  activeMode,
                  play: this.play,
                }} />
            )}

            <Player item={item} />
          </div>

          {item.type === 'show' && (
            <div className={classNames(classes[`item__row--${activeMode}`], classes.actions)}>

              {torrents && Object.keys(torrents).map(quality => (
                <button
                  key={quality}
                  style={{ zIndex: 1060 }}
                  onClick={() => this.playEpisode(torrents[quality])}
                  className={classNames('pct-btn pct-btn-trans pct-btn-outline pct-btn-round',
                    { 'pct-btn-available': torrents[quality] !== null })}>
                  {torrents[quality] !== null && (
                    <div>Play in {quality}</div>
                  )}

                  {torrents[quality] === null && (
                    <div>Search for {quality}</div>
                  )}
                </button>
              ))}

            </div>
          )}

          {item.type === 'show' && (
            <div className={classes[`item__row--${activeMode}`]}>
              <Seasons {...{
                seasons               : item.seasons,
                selectedSeason        : this.getSeason(),
                selectedEpisode       : this.getEpisode(),
                selectSeasonAndEpisode: this.selectSeasonAndEpisode,
              }} />

            </div>
          )}

        </div>
      </div>
    )
  }
}

Item.defaultProps = {
  itemId    : '',
  activeMode: 'movies',
}
