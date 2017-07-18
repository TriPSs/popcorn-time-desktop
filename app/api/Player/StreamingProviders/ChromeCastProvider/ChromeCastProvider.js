// @flow
import chromecastAPI from 'chromecasts'
import debug from 'debug'
import network from 'network-address'

import Power from 'api/Power'
import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { DeviceType } from '../StreamingTypes'
import { StreamingInterface } from '../StreamingInterface'
import type { ChromeCastApiType, ChromeCastType } from './ChromeCastTypes'

const log = debug('api:players:chromecast')

export class ChromeCastProvider implements StreamingInterface {

  provider: string = 'Chromecast'

  supportsSubtitles: boolean = true

  selectedDevice: ChromeCastType

  devices: Array<ChromeCastType> = []

  chromecasts: ChromeCastApiType

  status: string = PlayerStatuses.NONE

  checkProgressInterval: number

  states = {
    PLAYING  : PlayerStatuses.PLAYING,
    BUFFERING: PlayerStatuses.BUFFERING,
    PAUSED   : PlayerStatuses.PAUSED,
  }

  constructor() {
    this.chromecasts = chromecastAPI()
    this.chromecasts.on('update', this.onChromecastsUpdate)
  }

  onChromecastsUpdate = player => this.devices.push(player)

  getDevices = (timeout: number = 1000) => new Promise((resolve) => {
    this.chromecasts.update()

    setTimeout(() => {
      resolve(this.devices.map(device => ({
        name    : device.name,
        host    : device.host,
        provider: this.provider,
      })))
    }, timeout)
  })

  selectDevice = (device: DeviceType) => {
    log(`Selecting device ${device.name}`)

    this.selectedDevice = this.devices.find(chromecast => chromecast.host === device.host)
  }

  play = (uri: string, item: ContentType) => {
    log(`Play ${item.title}`)

    let streamingUrl = uri
    if (uri.indexOf('localhost')) {
      streamingUrl = uri.replace('localhost', network())
    }

    if (!this.selectedDevice) {
      throw new Error('No device selected')
    }

    Power.enableSaveMode()
    log(`Connecting to: ${this.selectedDevice.name} (${this.selectedDevice.host})`)

    this.updateStatus(PlayerStatuses.CONNECTING)
    this.loadedItem = item
    const media     = {
      type: 'video/mp4',
      // tracks: <-- For subtitles

      autoSubtitles: false,
      metadata     : {
        type        : 0,
        metadataType: 0,
        title       : item.title,
        images      : [{
          url: item.images.poster.medium,
        }],
      },
    }

    this.selectedDevice.play(streamingUrl, media, (error, status) => this.updateStatus(this.states[status.playerState]))
    this.selectedDevice.on('status', status => this.updateStatus(this.states[status.playerState]))
  }

  pause = () => {
    log('Pause...')
    if (this.selectedDevice && this.status !== PlayerStatuses.NONE) {
      this.selectedDevice.pause()
    }
  }

  stop = () => {
    log('Stop...')
    if (this.selectedDevice && this.status !== PlayerStatuses.NONE) {
      this.selectedDevice.stop()
    }
  }

  isPlaying = () => this.status === PlayerStatuses.PLAYING

  updateStatus = (nStatus) => {
    const newStatus = nStatus !== 'undefined' ? nStatus : PlayerStatuses.NONE

    if (newStatus !== this.status) {
      log(`Update status to ${newStatus}`)

      Events.emit(PlayerEvents.STATUS_CHANGE, {
        oldState: this.status,
        newStatus,
      })
      this.status = newStatus
      this.clearIntervals()

      if (newStatus === PlayerStatuses.PLAYING) {
        this.checkProgressInterval = this.progressInterval()
      }
    }
  }

  destroy = () => {
    if (this.status !== PlayerStatuses.NONE) {
      log('Destroy...')
      Power.disableSaveMode()

      if (this.selectedDevice) {
        this.selectedDevice.stop()
      }

      if (this.chromecasts) {
        this.chromecasts.destroy()
      }

      this.updateStatus(PlayerStatuses.NONE)
    }
  }

  progressInterval = () => setInterval(() => {
    if (this.selectedDevice) {
      this.selectedDevice.status((err, data) => {
        if (typeof data !== 'undefined') {
          const percentageComplete = ((data.currentTime / 60) / this.loadedItem.runtime.inMinutes) * 100

          if (percentageComplete > 90) {
            this.clearIntervals()
            Events.emit(PlayerEvents.VIDEO_ALMOST_DONE)
          }

        } else {
          this.clearIntervals()
          this.destroy()
        }
      })
    }
  }, 500)

  clearIntervals = () => {
    if (this.checkProgressInterval) {
      clearInterval(this.checkProgressInterval)
    }
  }
}

export default ChromeCastProvider
