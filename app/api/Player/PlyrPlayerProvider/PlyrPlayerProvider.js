// @flow
import debug from 'debug'
import plyr from 'plyr'

import Power from 'api/Power'
import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import { PlayerProviderInterface } from '../PlayerInterface'
import type { ContentType } from 'api/Metadata/MetadataTypes'

const log = debug('api:players:plyr')

class PlyrPlayerProvider implements PlayerProviderInterface {

  provider = 'Plyr'

  player: plyr

  status: string = PlayerStatuses.NONE

  checkProgressInterval: number

  loadedItem: ContentType

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

  load = (uri: string, item: ContentType) => {
    const player = this.getPlayer()
    log(`Load ${uri} into player...`)

    player.source({
      title  : item.title,
      type   : 'video',
      sources: [
        {
          src : uri,
          type: item.type,
        },
      ],
    })

    this.loadedItem = item
  }

  play = (uri: string, item: ContentType) => {
    if (this.isPlaying()) {
      return
    }
    
    if (uri && item) {
      this.load(uri, item)
    }

    Power.enableSaveMode()
    this.player.play()
  }

  pause = () => {
    if (this.player) {
      this.player.pause()
    }
  }

  stop = () => {
    if (this.player) {
      this.player.stop()
    }

    this.destroy()
  }

  isPlaying = () => this.status === PlayerStatuses.PLAYING

  setEventListeners = () => {
    this.player.on('play', this.onPlay)
    this.player.on('pause', this.onPause)
    this.player.on('ended', this.onEnded)
  }

  onPlay = () => {
    this.updateStatus(PlayerStatuses.PLAYING)

    this.checkProgressInterval = this.progressInterval()
  }

  onPause = () => this.updateStatus(PlayerStatuses.PAUSED)

  onEnded = () => this.updateStatus(PlayerStatuses.ENDED)

  updateStatus = (newStatus) => {
    log(`Update status to ${newStatus}`)

    Events.emit(PlayerEvents.STATUS_CHANGE, {
      oldState: this.status,
      newStatus,
    })
    this.status = newStatus
    this.clearIntervals()
  }

  destroy = () => {
    Power.disableSaveMode()
    this.clearIntervals()

    if (this.player) {
      this.player.destroy()
      this.player = null

      this.updateStatus(PlayerStatuses.NONE)
    }
  }

  progressInterval = () => setInterval(() => {
    if (this.player) {
      const percentageComplete = ((this.player.getCurrentTime() / 60) / this.loadedItem.runtime.inMinutes) * 100

      if (percentageComplete > 90) {
        this.clearIntervals()
        Events.emit(PlayerEvents.VIDEO_ALMOST_DONE)
      }
    }
  }, 500)

  clearIntervals = () => {
    if (this.checkProgressInterval) {
      clearInterval(this.checkProgressInterval)
    }
  }

}

export default PlyrPlayerProvider
