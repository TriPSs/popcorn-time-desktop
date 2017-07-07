// @flow
import { remote } from 'electron'
import debug from 'debug'
import plyr from 'plyr'

import { PlayerProviderInterface } from '../PlayerProviderInterface'
import type { MetadataType } from '../PlayerProviderTypes'

const { powerSaveBlocker } = remote
const log                  = debug('api:players:plyr')

class PlyrPlayerProvider implements PlayerProviderInterface {

  provider = 'Plyr'

  player: plyr

  powerSaveBlockerId: number

  state: string = null

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

  isPlaying = () => this.state === 'playing'

  setEventListeners = () => {
    this.player.on('play', this.onPlay)
    this.player.on('pause', this.onPause)
    this.player.on('ended', this.onEnded)

  }
  onPlay = () => {
    this.state = 'playing'
  }

  onPause = () => {
    this.state = 'paused'
  }

  onEnded = () => {
    this.state = 'ended'
  }

  destroy = () => {
    if (this.powerSaveBlockerId) {
      powerSaveBlocker.stop(this.powerSaveBlockerId)
    }

    if (this.player) {
      this.player.destroy()
    }
  }

  registerEvent = (event, callback) => {
    this.player.on(event, callback)
  }

}

export default PlyrPlayerProvider
