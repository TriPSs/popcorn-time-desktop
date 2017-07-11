/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'
import { Tooltip } from 'reactstrap'

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
    const { torrents, torrent, setTorrent } = this.props

    setTorrent(torrents[torrent.quality === '1080p' ? '720p' : '1080p'])
  }

  toggleMagnetTooltip = () => {
    const { magnetTooltipOpen } = this.state

    this.setState({
      magnetTooltipOpen: !magnetTooltipOpen,
    })
  }

  render() {
    const { magnetTooltipOpen } = this.state
    const { torrent }           = this.props

    return (
      <div className={classes.container}>
        <div className={classes.quality}>
          720
        </div>

        <Switch
          {...{
            on     : torrent.quality === '1080p',
            onClick: this.onQualityChange,
          }} />

        <div className={classes.quality}>
          1080
        </div>

        <div
          className={classes.health}
          id={'magnetTooltip'}>
          <i className={'ion-magnet'} />

          <div
            className={classes.health__status}
            style={{ backgroundColor: torrent.health.color }} />

          <Tooltip
            placement={'top'}
            isOpen={magnetTooltipOpen}
            target={'magnetTooltip'}
            toggle={this.toggleMagnetTooltip}>
            {torrent.seeds} Seeders
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default QualitySwitch