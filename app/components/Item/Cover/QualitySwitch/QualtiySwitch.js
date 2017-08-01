import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'reactstrap'

import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import Switch from 'react-toggle-switch'
import type { Props } from './QualtiySwitchTypes'
import classes from './QualtiySwitch.scss'

export class QualitySwitch extends React.Component {

  props: Props

  constructor(props) {
    super(props)

    this.state = {
      magnetTooltipOpen: false,
    }
  }

  onQualityChange = () => {
    const { torrent } = this.props

    this.selectTorrent(torrent.quality === '1080p' ? '720p' : '1080p')
  }

  selectTorrent = (quality) => {
    const { torrents, setTorrent } = this.props

    setTorrent(torrents[quality])
  }

  toggleMagnetTooltip = () => {
    const { magnetTooltipOpen } = this.state

    this.setState({
      magnetTooltipOpen: !magnetTooltipOpen,
    })
  }

  render() {
    const { magnetTooltipOpen }  = this.state
    const { showPlayInfo, mode } = this.props
    const { torrents, torrent }  = this.props

    return (
      <div className={classes.container} style={{ opacity: showPlayInfo ? 1 : 0 }}>
        {mode === MetadataConstants.TYPE_MOVIE && (
          <div className={classes.movie}>
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
          </div>
        )}

        {mode === MetadataConstants.TYPE_SHOW && torrents && (
          <div className={classes.show}>
            {Object.keys(torrents).map(quality => (
              <div
                key={quality}
                onClick={() => !torrents[quality] ? null : this.selectTorrent(quality)}
                className={classNames(classes.quality,
                  { [classes['quality--disabled']]: !torrents[quality] },
                  { [classes['quality--active']]: torrent && torrent.quality === quality },
                )}>
                {quality}
              </div>
            ))}
          </div>
        )}

        <div
          className={classes.health}
          id={'magnetTooltip'}>
          <i className={'ion-magnet'} />

          <div
            className={classes.health__status}
            style={{ backgroundColor: torrent ? torrent.health.color : 'black' }} />

          <Tooltip
            placement={'top'}
            isOpen={magnetTooltipOpen}
            target={'magnetTooltip'}
            toggle={this.toggleMagnetTooltip}>
            {torrent ? torrent.seeds : 0} Seeders
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default QualitySwitch
