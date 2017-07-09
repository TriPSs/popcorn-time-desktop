// @flow
import { remote } from 'electron'
import debug from 'debug'
import plyr from 'plyr'

import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import { PlayerProviderInterface } from '../PlayerProviderInterface'
import type { MetadataType } from '../PlayerProviderTypes'

const { powerSaveBlocker } = remote
const log                  = debug('api:players:plyr')

class PlyrPlayerProvider implements PlayerProviderInterface {

  provider = 'Plyr'

  player: plyr

  powerSaveBlockerId: number

  status: string = null

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
    this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
  }

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

  play = (uri: ?string, metadata: ?MetadataType) => {
    if (uri && metadata) {
      this.load(uri, metadata)
    }

    this.player.play()
  }

  pause = () => {
    this.player.pause()
  }

  stop = () => {
    this.player.stop()
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
    if (this.powerSaveBlockerId) {
      powerSaveBlocker.stop(this.powerSaveBlockerId)
    }

    if (this.player) {
      this.player.destroy()
    }
  }

}

export default PlyrPlayerProvider
