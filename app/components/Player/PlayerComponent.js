/**
 * @flow
 */
import React from 'react'
import classNames from 'classnames'

import MediaPlayer from 'api/Player'
import type { Props } from './PlayerTypes'
import * as Constants from './PlayerConstants'
import classes from './Player.scss'

export class Player extends React.Component {

  props: Props

  componentWillReceiveProps(nextProps) {
    const { status: newStatus, playerType: newPlayerType, uri: newUri } = nextProps
    const { status: oldStatus, playerType: oldPlayerType, uri: oldUri } = this.props

    if (oldPlayerType !== newPlayerType) {
      MediaPlayer.updatePlayerType(newPlayerType)
    }

    if (oldStatus !== newStatus) {
      const { uri, metadata } = nextProps

      MediaPlayer.handlePlayerStatusChange(newStatus, { uri, metadata })
    }
  }

  render() {
    const { playerType, stop } = this.props
    const { status, uri }      = this.props

    if (playerType !== Constants.PLAYER_TYPE_PLYR) {
      return null
    }

    return (
      <div
        style={{
          visibility: status !== Constants.PLAYER_STOP ? 'inherit' : 'hidden',
          display   : !!uri ? 'inherit' : 'none',
        }}
        className={classes.plyr}>

        <a role={'button'} onClick={stop}>Close</a>

        <video controls />
      </div>
    )
  }
}

export default Player
