/**
 * Created by tycho on 08/07/2017.
 */
import debug from 'debug'

const log = debug('api:events')

export class Events {

  listeners = []

  on = (event, cb) => {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    log(`Register on '${event}...`)
    this.listeners[event].push(cb)
  }

  emit = (event, data) => {
    if (!this.listeners[event]) {
      log(`'${event}' has no listeners...`)
      return
    }

    log(`Emit '${event}...`)
    this.listeners[event].forEach(cb => cb(event, data))
  }

}

export const instance = new Events()
export default instance
