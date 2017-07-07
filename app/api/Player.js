// @flow
import debug from 'debug'

import * as PlayerConstants from 'components/Player/PlayerConstants'
import { PlayerProviderInterface } from './players/PlayerProviderInterface'
import PlyrPlayerProvider from './players/PlyrPlayerProvider'
import PlayerAdapter from './players/PlayerAdapter'
import type { MetadataType } from './players/PlayerProviderTypes'
import Torrent from './Torrent'

const log = debug('api:player')

export class Player implements PlayerProviderInterface {

  playerSelected = 'plyr'

  playerAdapter: PlayerAdapter

  plyrAdapter: PlyrPlayerProvider

  constructor() {
    this.playerAdapter = new PlayerAdapter()
    this.plyrAdapter   = new PlyrPlayerProvider()

    Torrent.addEventListener(Torrent.EVENT_DONE_BUFFERING, this.play)
    Torrent.addEventListener(Torrent.EVENT_DONE_DOWNLOADED, this.play)
  }

  updatePlayerType = (player: string) => {
    log(`Change player from ${this.playerSelected} to ${player}`)
    this.playerSelected = player
  }

  changePlayerStatus = (status, { uri, metadata }) => {
    log(`Player state changes to: ${status}`)
    switch (status) {
      case PlayerConstants.PLAYER_PLAY:
        if (!metadata.type) {
          Torrent.start(uri, metadata, this.getRightPlayer().supportedFormats)

        } else {
          this.play({ uri, metadata })
        }
        break

      case PlayerConstants.PLAYER_PAUSE:
        this.pause()
        break

      case PlayerConstants.PLAYER_STOP:
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

  stop = () => {}

  getRightPlayer = () => {
    switch (this.playerSelected) {
      case 'chromecast':
        return null

      default:
        return this.plyrAdapter
    }
  }

  getStatus = () => this.getRightPlayer().getStatus()

  registerPlayerEvent = (event, callback) => this.getRightPlayer().registerEvent(event, callback)

  destroy() {
    this.getRightPlayer().destroy()
  }

  restart() {
    this.getRightPlayer().restart()
  }

}

export const MediaPlayer = new Player()

export default MediaPlayer
