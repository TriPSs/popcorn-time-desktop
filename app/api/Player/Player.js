// @flow
import debug from 'debug'

import { PlayerProviderInterface } from 'api/Player/PlayerInterface'
import PlyrPlayerProvider from 'api/Player/PlyrPlayerProvider'
import Torrent from 'api/Torrent'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'
import Events from 'api/Events'
import * as PlayerConstants from 'components/Player/PlayerConstants'
import { StreamingInterface } from './StreamingProviders/StreamingInterface'
import type { DeviceType } from './StreamingProviders/StreamingTypes'
import streamingProviders from './StreamingProviders'

const log = debug('api:player')

export class Player implements PlayerProviderInterface {

  providerSelected = 'Plyr'

  plyrAdapter: PlyrPlayerProvider

  streamingProviders: Array<StreamingInterface> = streamingProviders()

  lastPlayer = null

  supportedFormats = [
    'mp4',
    'ogg',
    'mov',
    'webmv',
    'mkv',
    'wmv',
    'avi',
  ]

  constructor() {
    this.plyrAdapter = new PlyrPlayerProvider()

    Events.on(TorrentEvents.STATUS_CHANGE, this.handleTorrentStatusChange)
  }

  handleTorrentStatusChange = (event, data) => {
    const { newStatus } = data

    if (newStatus === TorrentStatuses.BUFFERED || newStatus === TorrentStatuses.DOWNLOADED) {
      this.play(data)
    }
  }

  updatePlayerProvider = (provider: string) => {
    log(`Change provider from ${this.providerSelected} to ${provider}`)
    this.providerSelected = provider
  }

  selectDevice = (device: DeviceType) => {
    if (this.providerSelected !== this.plyrAdapter.provider) {
      this.getRightPlayer().selectDevice(device)
    }
  }

  firePlayerAction = (status, { uri, metadata }) => {
    log(`Player state changes to: ${status}`)

    switch (status) {
      case PlayerConstants.PLAYER_ACTION_PLAY:
        if (!metadata.type) {
          Torrent.start(uri, metadata, this.supportedFormats)

        } else {
          this.play({ uri, metadata })
        }
        break

      case PlayerConstants.PLAYER_ACTION_PAUSE:
        this.pause()
        break

      case PlayerConstants.PLAYER_ACTION_STOP:
        this.stop()
        break

      default:
    }
  }

  play = ({ uri, metadata }) => {
    const player = this.getRightPlayer()

    if (player && !player.isPlaying()) {
      player.play(uri, metadata)
    }
  }

  pause = () => {
    if (this.getRightPlayer().isPlaying()) {
      this.getRightPlayer().pause()
    }
  }

  stop = () => {
    Torrent.destroy()
    this.getRightPlayer().stop()
  }

  getRightPlayer = (): PlayerProviderInterface => {
    if (this.lastPlayer && this.lastPlayer.provider === this.providerSelected) {
      return this.lastPlayer
    }

    if (this.providerSelected !== this.plyrAdapter.provider) {
      return this.lastPlayer = this.streamingProviders.find(provider => provider.provider === this.providerSelected)
    }

    return this.lastPlayer = this.plyrAdapter
  }

  getDevices = () => Promise.all(
    this.streamingProviders.map(provider => provider.getDevices()),
  )

  // getStatus = () => this.getRightPlayer().getStatus()

  destroy = () => {
    Torrent.destroy()

    if (this.lastPlayer) {
      this.lastPlayer.destroy()
    }
  }

}

export const MediaPlayer = new Player()
export default MediaPlayer
