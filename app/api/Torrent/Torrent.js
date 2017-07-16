/**
 * Torrents controller, responsible for playing, stoping, etc
 * @flow
 */
import { remote } from 'electron'
import WebTorrent from 'webtorrent'
import debug from 'debug'

import Events from 'api/Events'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import * as TorrentEvents from './TorrentEvents'
import * as TorrentStatuses from './TorrentStatuses'

const log  = debug('api:torrent')
const port = 9091

export class Torrent {

  status: string = TorrentStatuses.NONE

  cacheLocation: string

  checkBufferInterval: number
  checkDownloadInterval: number

  engine: WebTorrent

  server: {
    close: () => void,
    listen: (port: number) => void
  }

  loadedItem: ContentType

  loadedMagnet: string

  constructor() {
    this.engine        = new WebTorrent({ maxConns: 20 })
    this.cacheLocation = remote.app.getPath('temp')
  }

  start(magnetURI: string, item: ContentType, supportedFormats: Array<string>) {
    if (this.status !== TorrentStatuses.NONE) {
      throw new Error('Torrent already in progress')
    }

    this.loadedItem   = item
    this.loadedMagnet = magnetURI

    this.updateStatus(TorrentStatuses.CONNECTING)

    log(`Using ${this.cacheLocation} to save the file!`)
    this.engine.add(magnetURI, { path: this.cacheLocation }, (torrent) => {
      if (!this.server) {
        const server = torrent.createServer()
        server.listen(port)
        this.server = server
      }

      const { files } = torrent

      const { file, torrentIndex } = files.reduce((previous, current, index) => {
          const formatIsSupported = !!supportedFormats.find(format => current.name.includes(format))

          if (formatIsSupported) {
            if (previous !== 'undefined' && current.length > previous.file.length) {
              previous.file.deselect()

              return {
                file        : current,
                torrentIndex: index,
              }
            }
          }

          return previous
        },
        { file: files[0], torrentIndex: 0 },
      )

      if (typeof torrentIndex !== 'number') {
        console.warn('File List', torrent.files.map(_file => _file.name))
        throw new Error(`No torrent could be selected. Torrent Index: ${torrentIndex}`)
      }

      file.select()

      this.checkBufferInterval = this.bufferInterval({ torrent, torrentIndex, item })
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

  bufferInterval = ({ torrent, torrentIndex, item }) => setInterval(() => {
    const toBuffer = (1024 * 1024) * 25

    if (torrent.downloaded > toBuffer) {
      this.updateStatus(TorrentStatuses.BUFFERED, {
        item,
        uri: `http://localhost:${port}/${torrentIndex}`,
      })

      this.clearIntervals()
      this.checkBufferInterval = this.downloadInterval({ torrent, torrentIndex, item })

    } else {
      this.updateStatus(TorrentStatuses.BUFFERING)

      Events.emit(TorrentEvents.BUFFERING, {
        progress     : torrent.downloaded / toBuffer,
        timeRemaining: ((toBuffer - torrent.downloaded) / torrent.downloadSpeed) * 1000,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
        peers        : torrent.numPeers,
      })
    }

  }, 1000)

  downloadInterval = ({ torrent, torrentIndex, item }) => setInterval(() => {
    if (torrent.downloaded >= torrent.length) {
      log('Download complete...')

      this.updateStatus(TorrentStatuses.DOWNLOADED, {
        item,
        uri: `http://localhost:${port}/${torrentIndex}`,
      })
      this.clearIntervals()

    } else {
      this.updateStatus(TorrentStatuses.DOWNLOADING)

      Events.emit(TorrentEvents.DOWNLOADING, {
        progress     : torrent.progress,
        timeRemaining: torrent.timeRemaining,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
        peers        : torrent.numPeers,
      })
    }
  }, 1000)

  updateStatus = (newStatus, data = {}) => {
    if (this.status !== newStatus) {
      log(`Update status to ${newStatus}`)

      Events.emit(TorrentEvents.STATUS_CHANGE, {
        oldStatus: this.status,
        newStatus,
        ...data,
      })

      this.status = newStatus
    }
  }

  destroy() {
    if (this.status !== TorrentStatuses.NONE) {
      log('Destroyed Torrent...')

      if (this.server && typeof this.server.close === 'function') {
        if (this.engine) {
          this.engine.remove(this.loadedMagnet)
        }

        this.server.close()
        this.server       = {}
        this.loadedMagnet = null
        this.loadedItem   = null
      }

      this.clearIntervals()

      this.updateStatus(TorrentStatuses.NONE)
    }
  }
}

export const instance = new Torrent()

export default instance

