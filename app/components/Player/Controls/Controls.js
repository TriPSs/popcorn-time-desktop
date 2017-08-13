// @flow
import React from 'react'
import classNames from 'classnames'

import * as PlayerConstants from 'api/Player/PlayerConstants'
import type { Props } from './ControlsTypes'
import classes from './Controls.scss'

export default ({ togglePlay, stop, playerStatus }: Props) => (
  <div className={classes.container}>

    <div className={classes.action}>
      <i
        role={'presentation'}
        onClick={togglePlay}
        className={classNames({
          'ion-ios-pause': playerStatus === PlayerConstants.STATUS_PLAYING,
          'ion-ios-play' : playerStatus === PlayerConstants.STATUS_PAUSED,
        })} />
    </div>

    <div className={classes.action}>
      <i
        role={'presentation'}
        onClick={stop}
        className={'ion-stop'} />
    </div>

  </div>
)
