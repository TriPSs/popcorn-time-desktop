/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'

import Switch from 'react-toggle-switch'
import type { Props } from './QualtiySwitchTypes'
import classes from './QualtiySwitch.scss'

export const QualitySwitch = ({ torrents, torrent, setTorrent }: Props) => {
  let on = torrent.quality === '1080p'

  const onClick = () => {
    on = !on
    setTorrent(torrents[on ? '1080p' : '720p'])
  }

  return (
    <div className={classes.container}>
      <div className={classes.quality}>
        720
      </div>

      <Switch
        {...{
          on,
          onClick,
        }} />

      <div className={classes.quality}>
        1080
      </div>

      <div className={classes.health}>
        <i className={'ion-magnet'} />

        <div
          className={classes.health__status}
          style={{ backgroundColor: torrent.health.color }} />
      </div>
    </div>
  )

}

export default QualitySwitch
