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
        this.setListeners()
      }
    }

    return this.player
  }

  load = (uri: string, metaData: MetadataType) => {
    const player = this.getPlayer()

    player.source({
      title  : metaData.title,
      type   : 'video',
      sources: [
        {
          src : uri,
          type: metaData.type || 'video/mp4',
        },
      ],
    })
  }

  play = (uri: ?string, metaData: ?MetadataType) => {
    if (uri && metaData) {
      this.load(uri, metaData)
    }

    this.player.play()
  }

  destroy = () => {
    if (this.powerSaveBlockerId) {
      powerSaveBlocker.stop(this.powerSaveBlockerId)
    }

    if (this.player) {
      this.player.destroy()
    }
  }

  setListeners = () => {
    log('Set events listeners...')

    this.player.on('play', this.onPlay)
    this.player.on('pause', this.onPause)
    this.player.on('ended', this.onEnded)
    this.player.on('progress', this.onProgress)
  }

  onPlay = (event) => {
    log('onPlay', event)
  }

  onPause = (event) => {
    log('onPause', event)
  }

  onEnded = (event) => {
    log('onEnded', event)
  }

  onProgress = (event) => {
    log('onProgress', event)
  }

}

export default PlyrPlayerProvider
