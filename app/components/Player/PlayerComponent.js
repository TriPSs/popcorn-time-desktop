/**
 * @flow
 */
import React from 'react'
import classNames from 'classnames'

import Events from 'api/Events'
import MediaPlayer from 'api/Player'
import * as TorrentEvents from 'api/Torrent/TorrentEvents'
import * as PlayerEvents from 'api/Player/PlayerEvents'
import * as PlayerStatuses from 'api/Player/PlayerStatuses'
import * as TorrentStatuses from 'api/Torrent/TorrentStatuses'

import type { Props } from './PlayerTypes'
import * as Constants from './PlayerConstants'
import classes from './Player.scss'
import Buffering from './Buffering'

export class Player extends React.Component {

  props: Props

  state = {
    torrentStatus: TorrentStatuses.NONE,
  }

  componentDidMount() {
    Events.on(PlayerEvents.STATUS_CHANGE, this.playerStatusChanged)
    Events.on(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
  }

  componentWillReceiveProps(nextProps) {
    const { playerAction: newPlayerAction, playerType: newPlayerType } = nextProps
    const { playerAction: oldPlayerAction, playerType: oldPlayerType } = this.props

    if (oldPlayerType !== newPlayerType) {
      MediaPlayer.updatePlayerType(newPlayerType)
    }

    if (oldPlayerAction !== newPlayerAction) {
      const { uri, metadata } = nextProps

      MediaPlayer.firePlayerAction(newPlayerAction, { uri, metadata })
    }
  }

  componentWillUnmount() {
    MediaPlayer.destroy()
  }

  playerStatusChanged = (event, data) => {
    const { newStatus }     = data
    const { updateStatus } = this.props

    updateStatus(newStatus)
  }

  torrentStatusChange = (event, data) => {
    const { newStatus } = data

    this.setState({
      torrentStatus: newStatus,
    })
  }

  isHidden = () => {
    const { torrentStatus } = this.state
    const { playerStatus }  = this.props

    if (playerStatus === PlayerStatuses.PLAYING) {
      return false
    }

    return torrentStatus === TorrentStatuses.NONE && playerStatus !== PlayerStatuses.PLAYING
  }

  renderVideo = () => {
    const { playerStatus, playerAction, uri, stop } = this.props

    return (
      <div
        style={{
          visibility: playerStatus === PlayerStatuses.PLAYING &&
                      playerAction !== Constants.PLAYER_ACTION_STOP ? 'inherit' : 'hidden',
          display   : !!uri ? 'inherit' : 'none',
        }}
        className={classes.plyr}>

        <a role={'button'} onClick={stop}>Close</a>

        <video controls />
      </div>
    )
  }

  render() {
    const { playerType, playerStatus, item } = this.props

    if (playerType !== Constants.PLAYER_TYPE_PLYR) {
      return null
    }

    const { torrentStatus } = this.state

    return (
      <div className={classNames({
        'col-sm-6': playerStatus !== PlayerStatuses.PLAYING,
        hidden    : this.isHidden(),
      }, classes.player)}>
        {torrentStatus === TorrentStatuses.CONNECTING && (
          <div className="col-sm-12" style={{ color: 'white' }}>
            Connecting
          </div>
        )}

        {torrentStatus === TorrentStatuses.BUFFERING && (
          <div className="col-sm-12" style={{ color: 'white' }}>
            Buffering
          </div>
        )}

        {this.renderVideo()}
      </div>
    )
  }
}

export default Player
