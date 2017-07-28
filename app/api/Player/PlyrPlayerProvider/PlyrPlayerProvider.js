// @flow
import ReduxClazz from 'redux-clazz'
import debug from 'debug'
import plyr from 'plyr'

import Power from 'api/Power'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import * as PlayerConstants from 'api/Player/PlayerConstants'
import { PlayerProviderInterface } from '../PlayerInterface'

const log = debug('api:players:plyr')

export class PlyrPlayerProvider extends ReduxClazz implements PlayerProviderInterface {

  provider = 'Plyr'

  player: plyr

  status: string = PlayerConstants.STATUS_NONE

  checkProgressInterval: number

  loadedItem: ContentType

  getPlayer = () => {
    if (!this.player) {
      this.player = plyr.setup({
        volume  : 10,
        autoplay: true,
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
          type: item.type === 'show' || item.type === 'movie' ? 'video/mp4' : item.type,
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
    if (this.player && this.isPlaying()) {
      this.player.pause()
    }
  }

  stop = () => {
    if (this.player && this.status !== PlayerConstants.STATUS_NONE) {
      this.player.stop()
    }
  }

  isPlaying = () => this.status === PlayerConstants.STATUS_PLAYING

  setEventListeners = () => {
    this.player.on('play', this.onPlay)
    this.player.on('pause', this.onPause)
    this.player.on('ended', this.onEnded)
  }

  onPlay = () => {
    this.updateStatus(PlayerConstants.STATUS_PLAYING)

    if (this.loadedItem.type !== 'youtube') {
      this.checkProgressInterval = this.progressInterval()
    }
  }

  onPause = () => {
    if (this.status !== PlayerConstants.STATUS_NONE) {
      this.updateStatus(PlayerConstants.STATUS_PAUSED)
    }
  }

  onEnded = () => this.updateStatus(PlayerConstants.STATUS_ENDED)

  updateStatus = (newStatus) => {
    const { updateStatus } = this.props

    if (this.status !== newStatus) {
      log(`Update status to ${newStatus}`)

      this.status = newStatus
      updateStatus(newStatus)
      this.clearIntervals()
    }
  }

  destroy = () => {
    Power.disableSaveMode()
    this.clearIntervals()

    if (this.player) {
      this.player.destroy()
      this.player = null

      this.updateStatus(PlayerConstants.STATUS_NONE)
    }
  }

  progressInterval = () => setInterval(() => {
    if (this.player) {
      const percentageComplete = ((this.player.getCurrentTime() / 60) / this.loadedItem.runtime.inMinutes) * 100

      if (percentageComplete > 90) {
        this.clearIntervals()
        const { videoAlmostDone } = this.props

        videoAlmostDone()
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
