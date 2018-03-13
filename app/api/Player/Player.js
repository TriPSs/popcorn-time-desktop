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

export default class extends ReduxClazz implements PlayerProviderInterface {

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

    this.plyrAdapter = new PlyrPlayerProvider()
  }

  clazzWillReceiveProps = (nextProps) => {
    const { playerStatus: oldPlayerStatus, action: oldAction, torrentStatus: oldTorrentStatus } = this.props
    const { playerStatus: newPlayerStatus, action: newAction, torrentStatus: newTorrentStatus } = nextProps

    if (oldPlayerStatus !== newPlayerStatus && newPlayerStatus === PlayerConstants.STATUS_ENDED) {
      this.destroy()
    }

    if (newTorrentStatus !== oldTorrentStatus) {
      if ((newTorrentStatus === TorrentConstants.STATUS_BUFFERED
           || newTorrentStatus === TorrentConstants.STATUS_DOWNLOADED)
          && this.getStatus() === PlayerConstants.STATUS_NONE) {
        const { uri, item } = nextProps

        this.play({ uri, item })
      }

    } else if (oldAction !== newAction && newAction) {
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

      case PlayerConstants.ACTION_CONTINUE:
      case PlayerConstants.ACTION_PAUSE:
        this.getRightPlayer().togglePlay()

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

  stop = () => {
    this.getRightPlayer().stop()
    this.getRightPlayer().destroy()

    this.destroy()
  }

  getStatus = () => this.getRightPlayer().status

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
    log('Destroy player')
    Torrent.destroy()

    if (this.getRightPlayer()) {
      this.getRightPlayer().destroy()

      this.streamingProviders.map(provider => provider.destroy())
    }
  }

}
