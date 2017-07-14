import debug from 'debug'

const log = debug('api:events')

export class Events {

  listeners = []

  on = (event, cb) => {
    log(`Register on '${event}'...`)
    this.listeners.push({
      event,
      cb,
    })
  }

  remove = (event, cb) => {
    this.listeners = this.listeners.filter(listener => listener.event !== event && listener.cb !== cb)
  }

  emit = (event, data) => {
    const listeners = this.listeners.filter(listener => listener.event === event)
    if (!listeners) {
      log(`'${event}' has no listeners...`)
      return
    }

    log(`Emit '${event} to ${listeners.length} listeners...`)
    listeners.forEach(({ cb }) => cb(event, data))
  }

}

export const instance = new Events()
export default instance
