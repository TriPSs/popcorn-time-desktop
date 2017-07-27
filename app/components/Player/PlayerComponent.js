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

  componentWillUnmount() {
    MediaPlayer.destroy()
  }

  shouldShowPlayer = () => {
    const { playerStatus, playerAction } = this.props

    return (playerStatus === PlayerConstants.STATUS_PLAYING
            || playerStatus === PlayerConstants.STATUS_PAUSED
            || playerStatus === PlayerConstants.STATUS_BUFFERING)
           && playerAction !== Constants.ACTION_STOP
  }

  isHidden = () => {
    const { torrentStatus } = this.props

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
    const { playerProvider, playerStatus } = this.props
    const { stop, torrentStatus }          = this.props

    return (
      <div
        className={classNames({
          'col-sm-6': !this.shouldShowPlayer() || playerProvider === Constants.PROVIDER_CHROMECAST,
          hidden    : this.isHidden(),
        }, classes.player)}>
        {torrentStatus !== TorrentConstants.STATUS_NONE && (
          <Stats {...{
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
