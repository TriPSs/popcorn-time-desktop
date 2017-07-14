// @flow
import { Client, PlatformSender, DefaultMediaReceiver } from 'castv2-client'
import mdns from 'mdns'
import debug from 'debug'
import network from 'network-address'

import Power from 'api/Power'
import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import type { MetadataType } from 'api/Player/PlayerTypes'
import type { DeviceType } from '../StreamingTypes'
import type { BrowserType } from './ChromeCastTypes'
import { StreamingInterface } from '../StreamingInterface'

const log = debug('api:players:chromecast')

export class ChromeCastProvider implements StreamingInterface {

  provider: string = 'Chromecast'

  supportsSubtitles: boolean = true

  selectedDevice: DeviceType

  devices: Array<DeviceType> = []

  browser: BrowserType

  status: string = PlayerStatuses.NONE

  states = {
    PLAYING  : PlayerStatuses.PLAYING,
    BUFFERING: PlayerStatuses.BUFFERING,
    PAUSED   : PlayerStatuses.PAUSED,
  }

  client: PlatformSender = null

  constructor() {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))
  }

  play = (uri: string, metadata: MetadataType) => {
    log(`Play ${metadata.title}`)

    let streamingUrl = uri
    if (uri.indexOf('localhost')) {
      streamingUrl = uri.replace('localhost', network())
    }

    this.client = new Client()

    if (!this.selectedDevice) {
      throw new Error('No device selected')
    }

    Power.enableSaveMode()
    log(`Connecting to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

    this.updateStatus(PlayerStatuses.CONNECTING)
    this.client.connect(this.selectedDevice.address, () => {
      log(`Connected to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

      this.client.launch(DefaultMediaReceiver, (error, player) => {
        // on close
        player.on('status', (status) => {
          this.updateStatus(this.states[status.playerState])
        })

        const media = {
          contentId  : streamingUrl,
          contentType: 'video/mp4',
          streamType : 'BUFFERED',

          metadata: {
            type        : 0,
            metadataType: 0,
            title       : metadata.title,
            images      : [{
              url: metadata.image.poster,
            }],
          },
        }

        player.load(media, { autoplay: true }, (error, status) => {
          this.updateStatus(this.states[status.playerState])
        })
      })
    })

    this.client.on('error', (error) => {
      log('Error: %s', error.message)

      this.client.close()
    })
  }

  pause = () => {
    log('Pause...')
  }

  stop = () => {
    log('Stop...')
    this.client.stop()
    this.destroy()
  }

  isPlaying = () => this.status === this.states.PLAYING

  getDevices = (timeout: number = 1000) => new Promise((resolve) => {
    const devices = []

    if (!this.browser) {
      resolve(devices)
    }

    this.browser.on('serviceUp', (service) => {
      devices.push({
        name    : service.txtRecord.fn,
        id      : service.fullname,
        address : service.addresses[0],
        port    : service.port,
        provider: this.provider,
      })
    })

    this.browser.start()

    setTimeout(() => {
      this.browser.stop()
      resolve(devices)
      this.devices = devices
    }, timeout)
  })

  selectDevice = (device: DeviceType) => {
    log(`Selecting device ${device.name}`)

    this.selectedDevice = device
  }

  updateStatus = (nStatus) => {
    const newStatus = nStatus !== 'undefined' ? nStatus : PlayerStatuses.NONE
    log(`Update status to ${newStatus}`)

    Events.emit(PlayerEvents.STATUS_CHANGE, {
      oldState: this.status,
      newStatus,
    })
    this.status = newStatus
  }

  destroy = () => {
    log('Destroy...')
    Power.disableSaveMode()
    this.browser = null

    if (this.client) {
      this.client.close()
      this.client = null
    }
  }

}

export default ChromeCastProvider
