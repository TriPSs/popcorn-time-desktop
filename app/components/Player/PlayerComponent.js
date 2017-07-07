/**
 * @flow
 */
import React from 'react'

import Torrent from 'api/Torrent'
import MediaPlayer from 'api/Player'
import type { Props } from './PlayerTypes'
import * as Constants from './PlayerConstants'
import classes from './Player.scss'
import Buffering from './Buffering'

export class Player extends React.Component {

  props: Props

  state = {
    loading: true,
  }

  constructor(props) {
    super(props)

    Torrent.addEventListener(Torrent.EVENT_START, this.onDoneBuffering)
    Torrent.addEventListener(Torrent.EVENT_DONE_BUFFERING, this.onDoneBuffering)
  }

  onStart = () => this.setState({ loading: true })

  onDoneBuffering = (data) => {
    console.log('done Buffering', data)
  }

  componentWillReceiveProps(nextProps) {
    const { status: newStatus, playerType: newPlayerType } = nextProps
    const { status: oldStatus, playerType: oldPlayerType } = this.props

    if (oldPlayerType !== newPlayerType) {
      MediaPlayer.updatePlayerType(newPlayerType)
    }

    if (oldStatus !== newStatus) {
      const { uri, metadata } = nextProps

      MediaPlayer.changePlayerStatus(newStatus, { uri, metadata })
    }
  }

  renderVideo = () => {
    const { status, uri, stop } = this.props

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

  render() {
    const { playerType, item } = this.props
    const { loading }              = this.state

    if (playerType !== Constants.PLAYER_TYPE_PLYR) {
      return null
    }

    return (
      <div>
        {loading && (
          <Buffering item={item} />
        )}

        {this.renderVideo()}
      </div>
    )
  }
}

export default Player
