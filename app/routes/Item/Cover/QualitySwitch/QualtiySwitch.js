import React from 'react'
import ReactTooltip from 'react-tooltip'

import Switch from 'react-toggle-switch'
import type { Props } from './QualtiySwitchTypes'
import classes from './QualtiySwitch.scss'

export class QualitySwitch extends React.Component {

  props: Props

  onQualityChange = () => {
    const { torrents, torrent, setTorrent } = this.props

    setTorrent(torrents[torrent.quality === '1080p' ? '720p' : '1080p'])
  }

  render() {
    const { torrent, showPlayInfo } = this.props

    return (
      <div className={classes.container} style={{ opacity: showPlayInfo ? 1 : 0 }}>
        <div className={classes.quality}>
          720
        </div>

        <Switch
          {...{
            on     : !torrent || torrent.quality === '1080p',
            onClick: this.onQualityChange,
          }} />

        <div className={classes.quality}>
          1080
        </div>

        <div
          data-tip
          data-for={'magnet-tooltip'}
          className={classes.health}>
          <i className={'ion-magnet'} />

          <div
            className={classes.health__status}
            style={{ backgroundColor: torrent ? torrent.health.color : 'black' }} />

          <ReactTooltip id={'magnet-tooltip'} effect={'solid'}>
            {torrent ? torrent.seeds : 0} Seeders
          </ReactTooltip>
        </div>
      </div>
    )
  }
}

export default QualitySwitch
