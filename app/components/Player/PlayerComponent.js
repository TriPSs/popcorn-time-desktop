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
import Stats from './Stats'

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
    const { playerAction: newPlayerAction } = nextProps
    const { playerAction: oldPlayerAction } = this.props

    if (oldPlayerAction !== newPlayerAction) {
      const { uri, metadata } = nextProps

      MediaPlayer.firePlayerAction(newPlayerAction, { uri, metadata })
    }
  }

  componentWillUnmount() {
    MediaPlayer.destroy()
  }

  playerStatusChanged = (event, data) => {
    const { newStatus }    = data
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
    const { playerProvider, playerStatus, item } = this.props
    const { torrentStatus }                      = this.state

    return (
      <div className={classNames({
        'col-sm-6': true, // playerStatus !== PlayerStatuses.PLAYING,
        // hidden    : this.isHidden(),
      }, classes.player)}>
        {torrentStatus !== TorrentStatuses.NONE && (
          <Stats item={item} torrentStatus={torrentStatus} />
        )}

        {playerProvider === Constants.PLAYER_PROVIDER_PLYR && this.renderVideo()}
      </div>
    )
  }
}

export default Player
