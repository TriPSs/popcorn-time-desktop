// @flow
import debug from 'debug'

import * as PlayerConstants from 'components/Player/PlayerConstants'
import { PlayerProviderInterface } from 'api/players/PlayerProviderInterface'
import PlyrPlayerProvider from 'api/players/PlyrPlayerProvider'
import PlayerAdapter from 'api/players/PlayerAdapter'
import Torrent from 'api/Torrent'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'
import Events from 'api/Events'

const log = debug('api:player')

export class Player implements PlayerProviderInterface {

  playerSelected = 'plyr'

  playerAdapter: PlayerAdapter

  plyrAdapter: PlyrPlayerProvider

  lastPlayer = null

  constructor() {
    this.playerAdapter = new PlayerAdapter()
    this.plyrAdapter   = new PlyrPlayerProvider()

    Events.on(TorrentEvents.STATUS_CHANGE, this.handleTorrentStatusChange)
  }

  handleTorrentStatusChange = (event, data) => {
    const { newStatus } = data

    if (newStatus === TorrentStatuses.BUFFERED || newStatus === TorrentStatuses.DOWNLOADED) {
      this.play(data)
    }
  }

  updatePlayerType = (player: string) => {
    log(`Change player from ${this.playerSelected} to ${player}`)
    this.playerSelected = player
  }

  firePlayerAction = (status, { uri, metadata }) => {
    log(`Player state changes to: ${status}`)
    switch (status) {
      case PlayerConstants.PLAYER_ACTION_PLAY:
        if (!metadata.type) {
          Torrent.start(uri, metadata, this.getRightPlayer().supportedFormats)

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
      log(`Load ${uri} into player...`)

      player.load(uri, metadata)
      player.play()
    }
  }

  pause = () => {}

  stop = () => {
    Torrent.destroy()
    this.getRightPlayer().stop()
  }

  getRightPlayer = () => {
    switch (this.playerSelected) {
      case 'chromecast':
        return null

      default:
        return this.lastPlayer = this.plyrAdapter
    }
  }

  getStatus = () => this.getRightPlayer().getStatus()

  destroy() {
    Torrent.destroy()

    if (this.lastPlayer) {
      this.lastPlayer.destroy()
    }
  }

  restart() {
    this.getRightPlayer().restart()
  }

}

export const MediaPlayer = new Player()

export default MediaPlayer
