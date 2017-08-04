import { remote } from 'electron'
import debug from 'debug'

const log                  = debug('api:power')
const { powerSaveBlocker } = remote

export default new (class {

  powerSaveBlockerId: number

  enableSaveMode = () => {
    if (!this.powerSaveBlockerId) {
      log('Starting save mode...')
      this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
    }
  }

  disableSaveMode = () => {
    if (this.powerSaveBlockerId) {
      log('Disabling save mode...')
      powerSaveBlocker.stop(this.powerSaveBlockerId)
      this.powerSaveBlockerId = null
    }
  }

})()
