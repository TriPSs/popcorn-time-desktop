// @flow
import { Client, PlatformSender, DefaultMediaReceiver } from 'castv2-client'
import mdns from 'mdns'
import debug from 'debug'
import network from 'network-address'

import Power from 'api/Power'
import Events from 'api/Events'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import type { ContentType } from 'api/Metadata/MetadataTypes'
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

  player = null

  constructor() {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))
  }

  play = (uri: string, item: ContentType) => {
    log(`Play ${item.title}`)

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
        this.player = player
        // on close
        this.player.on('status', (status) => {
          this.updateStatus(this.states[status.playerState])
        })

        const media = {
          contentId  : streamingUrl,
          contentType: 'video/mp4',
          streamType : 'BUFFERED',

          metadata: {
            type        : 0,
            metadataType: 0,
            title       : item.title,
            images      : [{
              url: item.images.poster.medium,
            }],
          },
        }

        this.player.load(media, { autoplay: true }, (error, status) => {
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
    // this.selectedDevice.pause()
  }

  stop = () => {
    log('Stop...')
    if (this.player) {
      this.player.stop()
    }
  }

  isPlaying = () => this.status === PlayerStatuses.PLAYING

  getDevices = (timeout: number = 1000) => new Promise((resolve) => {
    const devices = this.devices

    if (!this.browser || devices.length) {
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
    if (this.status !== PlayerStatuses.NONE) {
      log('Destroy...')
      Power.disableSaveMode()
      this.browser = null

      if (this.client) {
        this.client.close()
        this.client = null
        this.player = null
      }

      this.updateStatus(PlayerStatuses.NONE)
    }
  }

}

export default ChromeCastProvider
