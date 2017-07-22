// @flow
import React from 'react'
import classNames from 'classnames'

import MediaPlayer from 'api/Player'
import * as Constants from 'api/Player/PlayerConstants'
import * as PlayerConstants from 'api/Player/PlayerConstants'
import * as TorrentConstants from 'api/Torrent/TorrentConstants'

import type { Props } from './PlayerTypes'
import classes from './Player.scss'
import Stats from './Stats'

export class Player extends React.Component {

  props: Props

  state = {
    torrentStatus: TorrentConstants.STATUS_NONE,
  }

  componentDidMount() {
    // Events.on(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
  }

 /* componentWillReceiveProps(nextProps) {
    const { playerAction: newPlayerAction } = nextProps
    const { playerAction: oldPlayerAction } = this.props

    if (oldPlayerAction !== newPlayerAction) {
      const { uri, item } = nextProps

      MediaPlayer.firePlayerAction(newPlayerAction, {
        uri,
        item: {
          ...item,
          type: uri.indexOf('youtube') > -1 ? 'youtube' : 'video/mp4',
        },
      })
    }
  }*/

  componentWillUnmount() {
    // Events.remove(TorrentEvents.STATUS_CHANGE, this.torrentStatusChange)
    MediaPlayer.destroy()
  }

  torrentStatusChange = (event, data) => {
    const { newStatus } = data

    this.setState({
      torrentStatus: newStatus,
    })
  }

  shouldShowPlayer = () => {
    const { playerStatus, playerAction } = this.props

    return (playerStatus === PlayerConstants.STATUS_PLAYING
            || playerStatus === PlayerConstants.STATUS_PAUSED
            || playerStatus === PlayerConstants.STATUS_BUFFERING)
           && playerAction !== Constants.ACTION_STOP
  }

  isHidden = () => {
    const { torrentStatus } = this.state

    if (this.shouldShowPlayer()) {
      return false
    }

    return torrentStatus === TorrentConstants.STATUS_NONE
  }

  renderVideo = () => {
    const { uri, stop } = this.props

    return (
      <div
        style={{
          position  : this.shouldShowPlayer() ? 'fixed' : 'inherit',
          visibility: this.shouldShowPlayer() ? 'inherit' : 'hidden',
          display   : uri ? 'inherit' : 'none',
        }}
        className={classes.plyr}>

        <button
          className={classNames(
            classes.player__close,
            'pct-btn pct-btn-trans pct-btn-outline pct-btn-round')}
          onClick={stop}>
          <i className={'ion-ios-arrow-back'} />
          Close
        </button>

        <video controls />
      </div>
    )
  }

  render() {
    const { playerProvider, playerStatus, item } = this.props
    const { stop }                               = this.props
    const { torrentStatus }                      = this.state

    return (
      <div
        className={classNames({
          'col-sm-6': !this.shouldShowPlayer() || playerProvider === Constants.PROVIDER_CHROMECAST,
          hidden    : this.isHidden(),
        }, classes.player)}>
        {torrentStatus !== TorrentConstants.STATUS_NONE && (
          <Stats {...{
            item,
            playerProvider,
            playerStatus,
            torrentStatus,
            stopPlayer: stop,
          }} />
        )}

        {playerProvider === Constants.PROVIDER_PLYR && this.renderVideo()}
      </div>
    )
  }
}

export default Player
