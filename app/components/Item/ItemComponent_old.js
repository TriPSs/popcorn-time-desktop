import React from 'react'
import debug from 'debug'

import type { MetadataType } from 'api/players/PlayerProviderTypes'
import type { Props, State } from './ItemTypes'
import Background from './Background'
import Player from 'components/Player'
import classes from './Item.scss'

const log = debug('app:item')

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import notie from 'notie'
import { getIdealTorrent } from '../../api/torrents/BaseTorrentProvider'
import Butter from '../../api/Butter'
import Torrent from '../../api/Torrent'
import CardList from '../CardList'
import Rating from '../Rating'
import Show from '../show/Show'
import { convertFromBuffer, startServer as startSubtitleServer } from '../../api/Subtitle'

import type { contentType, imagesType } from '../../api/metadata/MetadataProviderInterface'
import ChromecastPlayerProvider from '../../api/players/ChromecastPlayerProvider'
import type { deviceType } from '../../api/torrents/TorrentProviderInterface'

const SUMMARY_CHAR_LIMIT = 300

type playerType = 'default' | 'plyr' | 'chromecast' | 'youtube';

export default class Item extends React.Component {

  props: Props

  butter: Butter

  torrent: Torrent

  state: State = {
    dropdownOpen     : false,
    isFinished       : false,
    selectedSeason   : 1,
    selectedEpisode  : 1,
    seasons          : [],
    season           : [],
    episode          : {},
    castingDevices   : [],
    currentPlayer    : 'default',
    playbackIsActive : false,
    fetchingTorrents : false,
    defaultTorrent   : null,
    torrent          : null,
    similarLoading   : false,
    metadataLoading  : false,
    torrentInProgress: false,
    torrentProgress  : 0,
  }

  playerProvider: ChromecastPlayerProvider

  constructor(props: Props) {
    super(props)

    this.torrent        = new Torrent()
    this.playerProvider = new ChromecastPlayerProvider()

    // this.subtitleServer = startSubtitleServer()
  }

  static defaultProps: Props

  /**
   * Check which players are available on the system
   */
  setPlayer = (player: playerType) => {
    log('Set player:', player)

    switch (player) {
      case 'youtube':
        const { item } = this.props

        const metaData: MetadataType = {
          title   : item.title,
          type    : 'youtube',
          image   : {
            poster: item.images.poster.medium,
          },
          autoPlay: true,
        }

        MediaPlayer.play(item.trailer, metaData)

        break

      default:
        this.setState({ currentPlayer: player })
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  async initCastingDevices() {
    this.setState({
      castingDevices: await this.playerProvider.getDevices(),
    })
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
    const { item: oldItem, match: { params: { itemId: oldItemId } } } = this.props
    const { item: newItem, match: { params: { itemId: newItemId } } } = nextProps

    if (newItemId !== oldItemId) {
      this.getAllData()

      window.scrollTo(0, 0)

      this.stopPlayback()

      this.setState({
        ...this.initialState,
      })
    }
  }

  getAllData() {
    const { getItem, match: { params: { itemId, activeMode } } } = this.props

    getItem(itemId, activeMode)

    /*this.setState(this.initialState, () => {
     if (this.props.activeMode === 'shows') {
     this.getShowData(
     'seasons',
     itemId,
     this.state.selectedSeason,
     this.state.selectedEpisode
     )
     }
     })*/

    /*return Promise.all([
     this.getItem(itemId).then((item: contentType) => {

     console.log(item)
     // this.getTorrent(item.ids.imdbId, item.title, 1, 1)
     }),

     // this.getSimilar(itemId)
     ])*/
  }

  async getShowData(type: string, imdbId: string, season?: number, episode?: number) {
    switch (type) {
      case 'seasons':
        this.setState({ seasons: [], episodes: [], episode: {} })
        this.setState({
          seasons : await Butter.getSeasons(imdbId),
          episodes: await Butter.getSeason(imdbId, 1),
          episode : await Butter.getEpisode(imdbId, 1, 1)
        })
        break
      case 'episodes':
        if (!season) {
          throw new Error('"season" not provided to getShowData()')
        }
        this.setState({ episodes: [], episode: {} })
        this.setState({
          episodes: await Butter.getSeason(imdbId, season),
          episode : await Butter.getEpisode(imdbId, season, 1)
        })
        break
      case 'episode':
        if (!season || !episode) {
          throw new Error(
            '"season" or "episode" not provided to getShowData()'
          )
        }
        this.setState({ episode: {} })
        this.setState({
          episode: await Butter.getEpisode(imdbId, season, episode)
        })
        break
      default:
        throw new Error('Invalid getShowData() type')
    }
  }

  /*/!**
   * Get the details of a movie using the butter api
   *!/
   async getItem(imdbId: string) {
   const { activeMode } = this.props

   this.setState({ metadataLoading: true })

   const item = await (() => {
   switch (this.props.activeMode) {
   case 'movie':
   return Butter.getMovie(imdbId)

   case 'show':
   return Butter.getShow(imdbId)

   default:
   throw new Error('Active mode not found')
   }
   })()

   this.setState({ item, metadataLoading: false })

   return item
   }*/

  async getTorrent(imdbId: string, title: string, season: number, episode: number) {
    this.setState({
      fetchingTorrents: true,
      idealTorrent    : this.defaultTorrent,
      torrent         : this.defaultTorrent,
    })

    try {
      const { torrent, idealTorrent } = await (async () => {
        switch (this.props.activeMode) {
          case 'movies': {
            const originalTorrent = await Butter.getTorrent(
              imdbId,
              this.props.activeMode,
              {
                searchQuery: title
              }
            )
            return {
              torrent     : originalTorrent,
              idealTorrent: getIdealTorrent([
                originalTorrent['1080p'],
                originalTorrent['720p'],
                originalTorrent['480p']
              ])
            }
          }
          case 'shows': {
            if (process.env.FLAG_SEASON_COMPLETE === 'cow') {
              const [shows, seasonComplete] = await Promise.all([
                Butter.getTorrent(imdbId, this.props.activeMode, {
                  season,
                  episode,
                  searchQuery: title
                }),
                Butter.getTorrent(imdbId, 'season_complete', {
                  season,
                  searchQuery: title
                })
              ])

              return {
                torrent     : {
                  '1080p': getIdealTorrent([
                    shows['1080p'],
                    seasonComplete['1080p']
                  ]),
                  '720p' : getIdealTorrent([
                    shows['720p'],
                    seasonComplete['720p']
                  ]),
                  '480p' : getIdealTorrent([
                    shows['480p'],
                    seasonComplete['480p']
                  ])
                },
                idealTorrent: getIdealTorrent([
                  shows['1080p'],
                  shows['720p'],
                  shows['480p'],
                  seasonComplete['1080p'],
                  seasonComplete['720p'],
                  seasonComplete['480p']
                ])
              }
            }

            const singleEpisodeTorrent = await Butter.getTorrent(
              imdbId,
              this.props.activeMode,
              {
                season,
                episode,
                searchQuery: title
              }
            )

            return {
              torrent     : singleEpisodeTorrent,
              idealTorrent: getIdealTorrent([
                singleEpisodeTorrent['1080p'] || this.defaultTorrent,
                singleEpisodeTorrent['720p'] || this.defaultTorrent,
                singleEpisodeTorrent['480p'] || this.defaultTorrent
              ])
            }
          }
          default:
            throw new Error('Invalid active mode')
        }
      })()

      console.log(torrent, idealTorrent)

      if (idealTorrent.quality === 'poor') {
        notie.alert(2, 'Slow torrent, low seeder count', 1)
      }

      this.setState({
        idealTorrent,
        fetchingTorrents: false,
        torrent         : {
          '1080p': torrent['1080p'] || this.defaultTorrent,
          '720p' : torrent['720p'] || this.defaultTorrent,
          '480p' : torrent['480p'] || this.defaultTorrent
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getSimilar(imdbId: string) {
    this.setState({ similarLoading: true })

    try {
      const similarItems = await Butter.getSimilar(
        this.props.activeMode,
        imdbId
      )

      this.setState({
        similarItems,
        similarLoading: false,
        isFinished    : true
      })
    } catch (error) {
      console.log(error)
    }
  }

  stopPlayback = () => {
    // MediaPlayer.destroy()
    this.torrent.destroy()
    this.setState({ torrentInProgress: false })
  }

  selectShow = (type: string, selectedSeason: number, selectedEpisode: number = 1) => {
    switch (type) {
      case 'episodes':
        this.setState({ selectedSeason })
        this.getShowData(
          'episodes',
          this.state.item.ids.tmdbId,
          selectedSeason
        )
        this.selectShow('episode', selectedSeason, 1)
        break
      case 'episode':
        this.setState({ selectedSeason, selectedEpisode })
        this.getShowData(
          'episode',
          this.state.item.ids.tmdbId,
          selectedSeason,
          selectedEpisode
        )
        this.getTorrent(
          this.state.item.ids.imdbId,
          this.state.item.title,
          selectedSeason,
          selectedEpisode
        )
        break
      default:
        throw new Error('Invalid selectShow() type')
    }
  }

  /**
   * 1. Retrieve list of subtitles
   * 2. If the torrent has subtitles, get the subtitle buffer
   * 3. Convert the buffer (srt) to vtt, save the file to a tmp dir
   * 4. Serve the file through http
   * 5. Override the default subtitle retrieved from the API
   */
  async getSubtitles(subtitleTorrentFile: Object = {},
                     activeMode: string,
                     item: contentType) {
    // Retrieve list of subtitles
    const subtitles = await Butter.getSubtitles(
      item.ids.imdbId,
      subtitleTorrentFile.name,
      subtitleTorrentFile.length,
      {
        activeMode
      }
    )

    if (!subtitleTorrentFile) {
      return subtitles
    }

    const { filename, port } = await new Promise((resolve, reject) => {
      subtitleTorrentFile.getBuffer((err, srtSubtitleBuffer) => {
        if (err) reject(err)
        // Convert to vtt, get filename
        resolve(convertFromBuffer(srtSubtitleBuffer))
      })
    })

    // Override the default subtitle
    const mergedResults = subtitles.map(
      (subtitle: Object) =>
        subtitle.default === true
          ? { ...subtitle, src: `http://localhost:${port}/${filename}` }
          : subtitle
    )

    return mergedResults
  }

  /*
   closeVideo() {
   if (MediaPlayer.MediaPlayer.isFullscreen()) {
   MediaPlayer.MediaPlayer.toggleFullscreen()
   } else {
   MediaPlayer.MediaPlayer.pause()
   // MediaPlayer.pause();
   this.toggleActive()
   }
   }*/

  toggleActive() {
    this.setState({
      playbackIsActive: !this.state.playbackIsActive
    })
  }

  startPlayback = async (magnet?: string, activeMode?: string) => {
    if (!magnet || !activeMode) {
      throw new Error('Magnet or activeMode not provided')
    }

    if (this.state.torrentInProgress) {
      this.stopPlayback()
    }

    this.setState({
      servingUrl       : undefined,
      torrentInProgress: true
    })

    const metadata = {
      activeMode,
      season : this.state.selectedSeason,
      episode: this.state.selectedEpisode
    }

    const formats = [
      //  ...MediaPlayer.experimentalPlaybackFormats,
//      ...MediaPlayer.nativePlaybackFormats
    ]

    this.torrent.start(magnet, metadata, formats, async (servingUrl: string, file: { name: string }, files: string, torrent: string, subtitle: string) => {
        log(`Serving at: ${servingUrl}`)
        this.setState({ servingUrl })

        const filename  = file.name
        const subtitles = subtitle && process.env.FLAG_SUBTITLES === 'true'
          ? await this.getSubtitles(
            subtitle,
            this.props.activeMode,
            this.state.item
          )
          : []

        const { currentPlayer } = this.state

        switch (currentPlayer) {
          case 'vlc':
            return MediaPlayer.initVLC(servingUrl)

          case 'chromecast':
            MediaPlayer.initCast(PlayerProvider, servingUrl, this.state.item)
            break

          case 'default':
            if (MediaPlayer.isFormatSupported(filename, MediaPlayer.nativePlaybackFormats)) {
              MediaPlayer.initPlyr(servingUrl, {
                poster: this.state.item.images.fanart.thumb,
                tracks: subtitles
              })
              this.toggleActive()
            } else if (
              MediaPlayer.isFormatSupported(filename, [
                ...MediaPlayer.nativePlaybackFormats,
                ...MediaPlayer.experimentalPlaybackFormats
              ])
            ) {
              notie.alert(2, 'The format of this video is not playable', 2)
              console.warn(`Format of filename ${filename} not supported`)
              console.warn('Files retrieved:', files)
            }
            break

          default:
            log('Invalid player:', currentPlayer)
            break
        }

        return torrent
      },
      downloaded => {
        log('Downloading:', downloaded)
      }
    )
  }

  render() {
    const {
            dropdownOpen, currentPlayer, seasons, selectedSeason, episodes, selectedEpisode,
            similarItems,
            similarLoading,
            isFinished,
            playbackIsActive,
          } = this.state

    const { activeMode, item, isLoading } = this.props

    if (isLoading || item === null) {
      return null
    }

    console.log(item)

  /*  const torrent    = item.torrents
    let idealTorrent = torrent['1080p']
*/
   /* const statusColorStyle = {
      backgroundColor: (() => {
        switch (idealTorrent.health) {
          case 'healthy':
            return 'green'
          case 'decent':
            return 'yellow'
          default:
            return 'red'
        }
      })()
    }
*/
    return (
      <div className={classNames('container-fluid', classes.item)}>
        <Link to={'/'}>
          <button className={'btn btn-back'} onClick={this.stopPlayback}>
            Back
          </button>
        </Link>

        <div className="row">
          <Player />

          <Background
            backgroundImage={item.images.fanart.full}
            poster={item.images.poster.thumb}>

            <div className="Movie col-sm-6">
              <h1 className="row-margin" id="title">
                {item.title}
              </h1>
              <div className="row">
                {item.runtime.short && (
                  <span className="col-sm-3" id="runtime">
                      <h6>
                        {item.runtime.short}
                      </h6>
                    </span>
                )}

                <span className="col-sm-9" id="genres">
                  {item.genres && (
                    <h6>
                      {item.genres.join(', ')}
                    </h6>
                  )}
                </span>
              </div>

              {/* HACK: Prefer a CSS solution to this, using text-overflow: ellipse */}

              <h6 className="row-margin" id="summary">
                {item.summary
                  ? item.summary.length > SUMMARY_CHAR_LIMIT
                   ? `${item.summary.slice(0, SUMMARY_CHAR_LIMIT)}...`
                   : item.summary
                  : ''}
              </h6>
              <div className="row row-margin row-center Item--details">
                {item.rating && typeof item.rating === 'number'
                  ? <div className="col-sm-4">
                   <Rating
                     emptyStarColor={'rgba(255, 255, 255, 0.2)'}
                     starColor={'white'}
                     rating={item.rating}
                   />
                 </div>
                  : null}
                <div className="col-sm-2">
                  <a className={classes['item-year']}>
                    {item.year}
                  </a>
                </div>

                {item && item.certification && item.certification !== 'n/a'
                  ? <div className="col-sm-3">
                   <div className="certification">
                     {item.certification}
                   </div>
                 </div>
                  : null}

                <div className="col-sm-2 row-center">
                  <i className="ion-magnet" />
                  <div className="Movie--status" style={statusColorStyle} />
                </div>

                {item.trailer && item.trailer !== 'n/a'
                  ? <div className="col-sm-3 row-center">
                   <i
                     className="ion-videocamera"
                     onClick={() => this.setPlayer('youtube')}
                   />
                 </div>
                  : null}
              </div>
            </div>
          </Background>

        {/*  <div className="row">
            <div className="col-sm-6">
              <span>
                      <button
                        onClick={() =>
                          this.startPlayback(
                            torrent['1080p'].magnet,
                            torrent['1080p'].method
                          )}
                        disabled={!torrent['1080p'].quality}
                      >
                        Start 1080p -- {torrent['1080p'].seed} seeders
                      </button>
                      <button
                        onClick={() =>
                          this.startPlayback(
                            torrent['720p'].magnet,
                            torrent['720p'].method
                          )}
                        disabled={!torrent['720p'].quality}
                      >
                        Start 720p -- {torrent['720p'].seed} seeders
                      </button>
                {(() => {
                  if (activeMode === 'shows') {
                    return (
                      <button
                        onClick={() =>
                          this.startPlayback(
                            torrent['480p'].magnet,
                            torrent['480p'].method
                          )}
                        disabled={!torrent['480p'].quality}
                      >
                        Start 480p -- {torrent['480p'].seeders} seeders
                      </button>
                    )
                  }

                  return null
                })()}
                    </span>

            </div>
            <div className="col-sm-6">
              <Dropdown
                style={{ float: 'right' }}
                isOpen={dropdownOpen}
                toggle={() => this.toggle()}
              >
                <DropdownToggle caret>
                  {currentPlayer || 'default'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Select Player</DropdownItem>
                  <DropdownItem onClick={() => this.setPlayer('default')}>
                    default
                  </DropdownItem>
                  {process.env.FLAG_CASTING === 'true'
                    ? this.state.castingDevices.map(castingDevice =>
                      <DropdownItem
                        onClick={() => {
                          this.setPlayer('chromecast')
                          this.playerProvider.selectDevice(castingDevice.id)
                        }}
                      >
                        {castingDevice.name}
                      </DropdownItem>
                    )
                    : null}
                  <DropdownItem onClick={() => this.setPlayer('vlc')}>
                    VLC
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

          </div>*/}

          {activeMode === 'shows'
            ? <Show
             selectShow={this.selectShow}
             seasons={seasons}
             episodes={episodes}
             selectedSeason={selectedSeason}
             selectedEpisode={selectedEpisode}
           />
            : null}

          <CardList
            title={'similar'}
            limit={4}
            items={similarItems}
            metadataLoading={similarLoading}
            isFinished={isFinished}
          />
        </div>
      </div>
    )
  }
}

Item.defaultProps = {
  itemId    : '',
  activeMode: 'movies',
}
