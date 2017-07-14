// @flow
import debug from 'debug'
import plyr from 'plyr'

import Power from 'api/Power'
import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import { PlayerProviderInterface } from '../PlayerInterface'
import type { MetadataType } from '../PlayerTypes'

const log = debug('api:players:plyr')

class PlyrPlayerProvider implements PlayerProviderInterface {

  provider = 'Plyr'

  player: plyr

  status: string = PlayerStatuses.NONE

  getPlayer = () => {
    if (!this.player) {
      this.player = plyr.setup({
        volume         : 10,
        autoplay       : true,
        showPosterOnEnd: true,
      })[0]

      if (this.player) {
        this.setEventListeners()
      }
    }

    return this.player
  }

  load = (uri: string, metadata: MetadataType) => {
    const player = this.getPlayer()
    log(`Load ${uri} into player...`)

    player.source({
      title  : metadata.title,
      type   : 'video',
      sources: [
        {
          src : uri,
          type: metadata.type || 'video/mp4',
        },
      ],
    })
  }

  play = (uri: string, metadata: MetadataType) => {
    if (uri && metadata) {
      this.load(uri, metadata)
    }

    Power.enableSaveMode()
    this.player.play()
  }

  pause = () => {
    this.player.pause()
  }

  stop = () => {
    this.player.stop()

    this.destroy()
  }

  isPlaying = () => this.status === PlayerStatuses.PLAYING

  setEventListeners = () => {
    this.player.on('play', this.onPlay)
    this.player.on('pause', this.onPause)
    this.player.on('ended', this.onEnded)
  }

  onPlay = () => this.updateStatus(PlayerStatuses.PLAYING)

  onPause = () => this.updateStatus(PlayerStatuses.PAUSED)

  onEnded = () => this.updateStatus(PlayerStatuses.ENDED)

  updateStatus = (newStatus) => {
    log(`Update status to ${newStatus}`)

    Events.emit(PlayerEvents.STATUS_CHANGE, {
      oldState: this.status,
      newStatus,
    })
    this.status = newStatus
  }

  destroy = () => {
    Power.disableSaveMode()

    if (this.player) {
      this.player.destroy()
      this.player = null

      this.updateStatus(PlayerStatuses.NONE)
    }
  }

}

export default PlyrPlayerProvider
