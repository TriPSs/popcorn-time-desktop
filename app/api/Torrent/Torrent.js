/**
 * Torrents controller, responsible for playing, stoping, etc
 * @flow
 */
import { remote } from 'electron'
import WebTorrent from 'webtorrent'
import debug from 'debug'

import Events from 'api/Events'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import * as TorrentConstants from './TorrentConstants'

const log  = debug('api:torrent')
const port = 9091

export class Torrent {

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
    const { status } = this.props

    if (status !== TorrentConstants.STATUS_NONE) {
      throw new Error('Torrent already in progress')
    }

    this.loadedItem   = item
    this.loadedMagnet = magnetURI

    this.updateStatus(TorrentConstants.STATUS_CONNECTING)

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

      this.checkBufferInterval = this.bufferInterval({ torrent, torrentIndex })
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

  bufferInterval = ({ torrent, torrentIndex }) => setInterval(() => {
    const toBuffer = (1024 * 1024) * 25

    if (torrent.downloaded > toBuffer) {
      this.updateStatus(TorrentConstants.STATUS_BUFFERED, {
        item: this.loadedItem,
        uri : `http://localhost:${port}/${torrentIndex}`,
      })

      this.clearIntervals()
      this.checkBufferInterval = this.downloadInterval({ torrent, torrentIndex })

    } else {
      this.updateStatus(TorrentConstants.STATUS_BUFFERING)

      const { buffering } = this.props

      buffering({
        progress     : torrent.downloaded / toBuffer,
        timeRemaining: ((toBuffer - torrent.downloaded) / torrent.downloadSpeed) * 1000,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
        peers        : torrent.numPeers,
      })
    }

  }, 1000)

  downloadInterval = ({ torrent, torrentIndex }) => setInterval(() => {
    if (torrent.downloaded >= torrent.length) {
      log('Download complete...')

      this.updateStatus(TorrentConstants.STATUS_DOWNLOADED, {
        item: this.loadedItem,
        uri : `http://localhost:${port}/${torrentIndex}`,
      })
      this.clearIntervals()

    } else {
      this.updateStatus(TorrentConstants.STATUS_DOWNLOADING)

      const { downloading } = this.props

      downloading({
        progress     : torrent.progress,
        timeRemaining: torrent.timeRemaining,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
        peers        : torrent.numPeers,
      })
    }
  }, 1000)

  updateStatus = (newStatus, data = {}) => {
    const { status, updateStatus } = this.props

    if (status !== newStatus) {
      log(`Update status to ${newStatus}`)

      updateStatus(newStatus, data)
    }
  }

  destroy() {
    const { status, updateStatus } = this.props

    if (status !== TorrentConstants.STATUS_NONE) {
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

      updateStatus(TorrentConstants.STATUS_NONE)
    }
  }
}

export default Torrent

