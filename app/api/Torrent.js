/**
 * Torrents controller, responsible for playing, stoping, etc
 * @flow
 */
import os from 'os'
import WebTorrent from 'webtorrent'
import debug from 'debug'
import type { MetadataType } from './players/PlayerProviderTypes'

const log  = debug('api:torrent')
const port = 9091

export class Torrent {

  EVENT_START           = 'starting'
  EVENT_BUFFERING       = 'buffering'
  EVENT_DONE_BUFFERING  = 'buffered'
  EVENT_DONE_DOWNLOADED = 'downloaded'
  EVENT_DOWNLOADING     = 'downloading'

  eventListeners = []

  cacheLocation: string

  inProgress: boolean = false

  doneBuffering: boolean = false

  finished: boolean = false

  checkBufferInterval: number
  checkDownloadInterval: number

  engine: WebTorrent

  server: {
    close: () => void,
    listen: (port: number) => void
  }

  constructor() {
    this.engine        = new WebTorrent({ maxConns: 20 })
    this.cacheLocation = os.tmpdir()
  }

  start(magnetURI: string, metadata: MetadataType, supportedFormats: Array<string>) {
    if (this.inProgress) {
      throw new Error('Torrent already in progress')
    }

    this.inProgress = true

    this.fireEvent(this.EVENT_START, null)

    log(`Using ${this.cacheLocation} to save the file!`)
    this.engine.add(magnetURI, { path: this.cacheLocation }, (torrent) => {
      if (!this.server) {
        const server = torrent.createServer()
        server.listen(port)
        this.server = server
      }

      const { file, torrentIndex } = torrent.files.reduce((previous, current, index) => {
          const formatIsSupported = !!supportedFormats.find(format => current.name.includes(format))

          if (formatIsSupported) {
            if (previous && current.length > previous.file.length) {
              previous.file.deselect()
            }

            return {
              file        : current,
              torrentIndex: index,
            }
          }
        },
        { file: torrent.files[0], torrentIndex: 0 },
      )

      if (typeof torrentIndex !== 'number') {
        console.warn('File List', torrent.files.map(_file => _file.name))
        throw new Error(`No torrent could be selected. Torrent Index: ${torrentIndex}`)
      }

      file.select()

      this.checkBufferInterval = this.bufferInterval({ torrent, torrentIndex, metadata })
    })
  }

  clearIntervals = () => {
    if (this.checkBufferInterval) {
      clearInterval(this.checkBufferInterval)
    }

    if (this.checkDownloadInterval) {
      clearInterval(this.checkDownloadInterval)
    }
  }

  bufferInterval = ({ torrent, torrentIndex, metadata }) => setInterval(() => {
    if (torrent.downloaded > (1024 * 1024) * 50) {
      this.fireEvent(this.EVENT_DONE_BUFFERING, {
        torrent,
        torrentIndex,
        metadata,
        uri: `http://localhost:${port}/${torrentIndex}`,
      })

      this.clearIntervals()
      this.checkBufferInterval = this.downloadInterval({ torrent, torrentIndex, metadata })

    } else {
      this.fireEvent(this.EVENT_BUFFERING, {
        downloaded   : torrent.downloaded,
        toDownload   : torrent.length,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
      })
    }

  }, 1000)

  downloadInterval = ({ torrent, torrentIndex, metadata }) => setInterval(() => {
    if (torrent.downloaded >= torrent.length) {
      log('Download complete...')

      this.fireEvent(this.EVENT_DONE_DOWNLOADED, {
        torrent,
        torrentIndex,
        metadata,
        uri: `http://localhost:${port}/${torrentIndex}`,
      })

      this.clearIntervals()

    } else {
      log('Downloading...')

      this.fireEvent(this.EVENT_DOWNLOADING, {
        downloaded   : torrent.downloaded,
        toDownload   : torrent.length,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
      })
    }
  }, 1000)

  addEventListener = (event, callback) => {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }

    this.eventListeners[event].push(callback)
  }

  fireEvent = (event, data) => {
    if (!this.eventListeners[event]) {
      return
    }

    log(`Fire event: ${event}`, data)
    this.eventListeners[event].forEach(callback => callback(data))
  }

  destroy() {
    if (this.inProgress) {
      console.log('Destroyed Torrent...')

      if (this.server && typeof this.server.close === 'function') {
        this.server.close()
        this.server = {}
      }

      this.clearIntervals()

      this.engine.destroy()
      this.engine = undefined

      this.inProgress = false
    }
  }
}

export const instance = new Torrent()

export default instance

