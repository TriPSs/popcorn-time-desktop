import { remote } from 'electron'

const { powerSaveBlocker } = remote

export class Power {

  powerSaveBlockerId: number

  enableSaveMode = () => {
    if (!this.powerSaveBlockerId) {
      this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
    }
  }

  disableSaveMode = () => {
    if (this.powerSaveBlockerId) {
      powerSaveBlocker.stop(this.powerSaveBlockerId)
      this.powerSaveBlockerId = null
    }
  }

}

export const instance = new Power()
export default instance
