// @flow
import { Client, DefaultMediaReceiver } from 'castv2-client'
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

  constructor() {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))
  }

  play = (uri: string, metadata: MetadataType) => {
    log(`Play ${metadata.title}`)

    let streamingUrl = uri
    if (uri.indexOf('localhost')) {
      streamingUrl = uri.replace('localhost', network())
    }

    const client = new Client()

    if (!this.selectedDevice) {
      throw new Error('No device selected')
    }

    Power.enableSaveMode()
    log(`Connecting to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

    this.updateStatus(PlayerStatuses.CONNECTING)
    client.connect(this.selectedDevice.address, () => {
      log(`Connected to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

      client.launch(DefaultMediaReceiver, (error, player) => {
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

    client.on('error', (error) => {
      log('Error: %s', error.message)

      client.close()
    })
  }

  pause = () => {

  }

  stop = () => {

  }

  isPlaying = () => {

  }

  getDevices = (timeout: number = 1000) => new Promise((resolve) => {
    const devices = []

    if (!this.browser) {
      resolve(devices);
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
    this.browser = null
  }

  /*play(contentUrl: string, item) {
   const client = new Client()

   if (!this.selectDevice) {
   throw new Error('No device selected')
   }

   return new Promise((resolve, reject) => {
   log(`Connecting to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

   client.connect(this.selectedDevice.address, () => {
   log(`Connected to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

   client.launch(DefaultMediaReceiver, (error, player) => {
   if (error) {
   reject(error)
   }

   // on close

   player.on('status', (status) => {
   log('Status broadcast playerState=%s', status.playerState)
   })

   const media = {
   // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
   contentId  : contentUrl,
   contentType: 'video/mp4',
   streamType : 'BUFFERED', // or LIVE

   // Title and cover displayed while buffering
   metadata: {
   type        : 0,
   metadataType: 0,
   title       : item.title,
   images      : [
   {
   url: item.images.poster.full || item.images.fanart.full
   }
   ]
   }
   }

   player.load(media, { autoplay: true }, (error) => {
   if (error) {
   reject(error)
   }
   resolve()
   })
   })
   })

   client.on('error', (error) => {
   console.log('Error: %s', error.message)

   client.close()

   reject(error) // Error
   })
   })
   }*/
}

export default ChromeCastProvider
