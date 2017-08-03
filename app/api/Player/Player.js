// @flow
import ReduxClazz from 'redux-clazz'
import debug from 'debug'
import { PlayerProviderInterface } from 'api/Player/PlayerInterface'
import PlyrPlayerProvider from 'api/Player/PlyrPlayerProvider'
import Torrent from 'api/Torrent'
import * as TorrentConstants from 'api/Torrent/TorrentConstants'
import * as PlayerConstants from './PlayerConstants'
import { streamingProviders, StreamingInterface } from './StreamingProviders'
import type { DeviceType } from './StreamingProviders/StreamingTypes'
import type { Props } from './PlayerTypes'

const log = debug('api:player')

export class Player extends ReduxClazz implements PlayerProviderInterface {

  plyrAdapter: PlyrPlayerProvider

  streamingProviders: Array<StreamingInterface> = streamingProviders()

  lastPlayer = null

  props: Props

  supportedFormats = [
    'mp4',
    'ogg',
    'mov',
    'webmv',
    'mkv',
    'wmv',
    'avi',
  ]

  constructor(...props) {
    super(...props)

    this.plyrAdapter = PlyrPlayerProvider
  }

  clazzWillReceiveProps = (nextProps) => {
    const { action: oldAction, torrentStatus: oldTorrentStatus } = this.props
    const { action: newAction, torrentStatus: newTorrentStatus } = nextProps

    if (newTorrentStatus !== oldTorrentStatus) {
      if (newTorrentStatus === TorrentConstants.STATUS_BUFFERED
          || newTorrentStatus === TorrentConstants.STATUS_DOWNLOADED) {
        const { uri, item } = nextProps

        this.play({ uri, item })
      }

    } else if (oldAction !== newAction) {
      const { uri, item } = nextProps

      this.handleActionChange(
        newAction, { uri, item },
      )
    }
  }

  selectDevice = (device: DeviceType) => {
    const { provider } = this.props

    if (provider !== this.plyrAdapter.provider) {
      this.getRightPlayer().selectDevice(device)
    }
  }

  handleActionChange = (action, { uri, item }) => {
    log(`Fire player action ${action}`)

    switch (action) {
      case PlayerConstants.ACTION_PLAY:
        if (uri.indexOf('youtube') > -1) {
          this.plyrAdapter.play(uri, { ...item, type: 'youtube' })

        } else {
          Torrent.start(uri, item, this.supportedFormats)
        }

        break

      case PlayerConstants.ACTION_PAUSE:
        this.pause()
        break

      case PlayerConstants.ACTION_STOP:
        this.stop()
        break

      default:
    }
  }

  play = ({ uri, item }) => {
    const { provider } = this.props

    log(`Fire play in ${provider}`)
    const player = this.getRightPlayer()

    if (player && !player.isPlaying()) {
      player.play(uri, item)
    }
  }

  pause = () => {
    if (this.getRightPlayer().isPlaying()) {
      this.getRightPlayer().pause()
    }
  }

  stop = () => {
    if (this.getRightPlayer().status !== PlayerConstants.STATUS_NONE) {
      this.getRightPlayer().stop()
      this.getRightPlayer().destroy()
    }

    this.destroy()
  }

  getStatus = () => this.getRightPlayer().getStatus()

  getRightPlayer = (): PlayerProviderInterface => {
    const { provider } = this.props

    if (this.lastPlayer && this.lastPlayer.provider === provider) {
      return this.lastPlayer
    }

    if (provider !== this.plyrAdapter.provider) {
      return this.lastPlayer = this.streamingProviders.find(streamingProv => streamingProv.provider === provider)
    }

    return this.lastPlayer = this.plyrAdapter
  }

  getDevices = () => Promise.all(
    this.streamingProviders.map(provider => provider.getDevices()),
  )

  destroy = () => {
    Torrent.destroy()

    if (this.lastPlayer) {
      this.lastPlayer.destroy()

      this.streamingProviders.map(provider => provider.destroy())
    }
  }

}

export default Player
