//@flow
import { remote } from 'electron'
import WebTorrent from 'webtorrent'
import portfinder from 'portfinder'
import debug from 'debug'

import ReduxClazz from 'redux-clazz'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import * as TorrentConstants from './TorrentConstants'

const log = debug('api:torrent')

export default class extends ReduxClazz {

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

  port: number

  constructor(...context) {
    super(...context)
    this.engine        = new WebTorrent({ maxConns: 20 })
    this.cacheLocation = remote.app.getPath('temp')
  }

  start = (magnetURI: string, item: ContentType, supportedFormats: Array<string>) => {
    const { status } = this.props

    if (status !== TorrentConstants.STATUS_NONE) {
      throw new Error('Torrent already in progress')
    }

    this.loadedItem   = item
    this.loadedMagnet = magnetURI

    this.updateStatus(TorrentConstants.STATUS_CONNECTING)

    log(`Using ${this.cacheLocation} to save the file!`)
    this.engine.add(magnetURI, { path: this.cacheLocation }, torrent => this.createServer(torrent).then(() => {
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

      }, { file: files[0], torrentIndex: 0 })

      if (typeof torrentIndex !== 'number') {
        throw new Error(`No torrent could be selected. Torrent Index: ${torrentIndex}`)
      }

      file.select()

      this.checkBufferInterval = this.bufferInterval({ torrent, torrentIndex, fileName: file.name })
    }))
  }

  createServer = torrent => new Promise((resolve) => {
    log('Creating torrent server...')

    if (this.server) {
      log('There already is a server..')
      return resolve()
    }

    log('Searching available port...')
    return portfinder.getPortPromise({ port: 9091 }).then((port) => {
      log('Creating server on port %s...', port)
      this.server = torrent.createServer()
      this.port   = port
      this.server.listen(port)

      resolve()
    })
  })

  clearIntervals = () => {
    if (this.checkBufferInterval) {
      clearInterval(this.checkBufferInterval)
    }

    if (this.checkDownloadInterval) {
      clearInterval(this.checkDownloadInterval)
    }
  }

  bufferInterval = ({ torrent, torrentIndex, fileName }) => setInterval(() => {
    const toBuffer = (1024 * 1024) * 25

    if (torrent.downloaded > toBuffer) {
      this.updateStatus(TorrentConstants.STATUS_BUFFERED, {
        item: this.loadedItem,
        uri : `http://localhost:${this.port}/${torrentIndex}/${fileName}`,
      })

      this.clearIntervals()
      this.checkBufferInterval = this.downloadInterval({ torrent, torrentIndex, fileName })

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

  downloadInterval = ({ torrent, torrentIndex, fileName }) => setInterval(() => {
    if (torrent.downloaded >= torrent.length) {
      log('Download complete...')

      this.updateStatus(TorrentConstants.STATUS_DOWNLOADED, {
        item: this.loadedItem,
        uri : `http://localhost:${this.port}/${torrentIndex}/${fileName}`,
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

  updateStatus = (newStatus, data = { uri: this.loadedMagnet, item: this.loadedItem }) => {
    const { status, updateStatus } = this.props

    if (status !== newStatus) {
      log(`Update status to ${newStatus}`)

      updateStatus(newStatus, data)
    }
  }

  destroy = () => {
    const { status, updateStatus } = this.props

    if (status !== TorrentConstants.STATUS_NONE) {
      log('Destroyed Torrent...')

      if (this.engine) {
        this.engine.remove(this.loadedMagnet)


        this.loadedMagnet = null
        this.loadedItem   = null
      }

      if (this.server) {
        this.server.close()
        this.server = null
        this.port   = null
      }

      this.clearIntervals()

      updateStatus(TorrentConstants.STATUS_NONE, { uri: null, item: null })
    }
  }
}
