// @flow
import debug from 'debug'

import * as PlayerConstants from 'components/Player/PlayerConstants'
import { PlayerProviderInterface } from './players/PlayerProviderInterface'
import PlyrPlayerProvider from './players/PlyrPlayerProvider'
import PlayerAdapter from './players/PlayerAdapter'
import type { MetadataType } from './players/PlayerProviderTypes'

const log = debug('api:player')

export class Player implements PlayerProviderInterface {

  playerSelected = 'plyr'

  playerStatus = null

  playerAdapter: PlayerAdapter

  plyrAdapter: PlyrPlayerProvider

  constructor() {
    // this.playerAdapter = new PlayerAdapter()
    this.plyrAdapter = new PlyrPlayerProvider()
  }

  updatePlayerType = (player: string) => {
    log(`Change player from ${this.playerSelected} to ${player}`)
    this.playerSelected = player
  }

  handlePlayerStatusChange = (status, { uri, metadata }) => {
    log(`Player state changes to: ${status}`)
    switch (status) {
      case PlayerConstants.PLAYER_PLAY:
        this.play(uri, metadata)
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

  play = (uri: string, metaData: MetadataType, autoPlay: boolean = true) => {
    const player = this.getRightPlayer()

    if (player) {
      player.load(uri, metaData)

      if (autoPlay) {
        player.play()
      }
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

  getStatus = () => this.playerStatus

  /**
   * Cleanup all traces of the player UI
   */
  destroy() {
    this.getRightPlayer().destroy()
  }

  restart() {
    this.getRightPlayer().restart()
  }

}

export const MediaPlayer = new Player()

export default MediaPlayer
