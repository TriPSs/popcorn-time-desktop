/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import Events from 'api/Events'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'
import type { Props, State } from './StatsTypes'
import classes from './Stats.scss'

export class Buffering extends React.Component {

  props: Props

  state: State = {
    progress     : 0,
    timeRemaining: 0,
    downloadSpeed: 0,
    uploadSpeed  : 0,
    peers        : 0,
  }

  componentDidMount() {
    Events.on(TorrentEvents.BUFFERING, this.onBuffering)
    Events.on(TorrentEvents.DOWNLOADING, this.onBuffering)
  }

  onBuffering = (event, data) => {
    this.setState({
      ...data,
    })
  }

  status = {
    [TorrentStatuses.CONNECTING] : 'Connecting...',
    [TorrentStatuses.DOWNLOADING]: 'Downloading...',
    [TorrentStatuses.BUFFERING]  : 'Buffering...',
    [TorrentStatuses.DOWNLOADED] : 'Complete',
  }

  sizes = ['Bytes/s', 'KB/s', 'MB/s']

  formatKbToString = (bytes) => {
    if (bytes === 0) {
      return '0 Byte'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${this.sizes[i]}`
  }

  formatMillisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes`
  }

  render() {
    const { item, torrentStatus } = this.props

    const { downloadSpeed, uploadSpeed, peers, progress, timeRemaining } = this.state

    return (
      <div className={classNames('col-sm-12', classes.stats)}>
        <h1 className={'row-margin'}>
          {item.title}
        </h1>

        <h6 className={classes.stats__text}>
          {this.status[torrentStatus]}
        </h6>

        <div>Download {this.formatKbToString(downloadSpeed)}</div>
        <div>Upload {this.formatKbToString(uploadSpeed)}</div>
        <div>Peers {peers}</div>

        <div className={classes.progress}>
          <span
            style={{ width: `${parseFloat(progress * 100).toFixed(2)}%` }}>
            {parseFloat(progress * 100).toFixed(2)}%
          </span>
        </div>
        <div>Time left {this.formatMillisToMinutesAndSeconds(timeRemaining)}</div>

        <div>
          CONTROLS HERE
        </div>

      </div>
    )
  }
}

export default Buffering
