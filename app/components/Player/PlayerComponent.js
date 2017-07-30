// @flow
import React from 'react'
import classNames from 'classnames'

import MediaPlayer from 'api/Player'
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

  isHidden = () => {
    const { torrentStatus } = this.props

    if (this.shouldShowPlayer()) {
      return false
    }

    return torrentStatus === TorrentConstants.STATUS_NONE
  }


  shouldShowPlayer = () => {
    const { playerStatus, playerAction } = this.props

    return (playerStatus === PlayerConstants.STATUS_PLAYING
            || playerStatus === PlayerConstants.STATUS_PAUSED
            || playerStatus === PlayerConstants.STATUS_BUFFERING)
           && playerAction !== PlayerConstants.ACTION_STOP
  }

  shouldShowControls = () => {
    const { playerProvider, playerStatus } = this.props

    if (playerProvider !== PlayerConstants.PROVIDER_PLYR) {
      return false
    }

    return playerStatus === PlayerConstants.STATUS_PLAYING || playerStatus === PlayerConstants.STATUS_PAUSED
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
          'col-sm-6': !this.shouldShowPlayer() || playerProvider === PlayerConstants.PROVIDER_CHROMECAST,
          [classes['player--hidden']]: this.isHidden(),
        }, classes.player)}>

        {torrentStatus !== TorrentConstants.STATUS_NONE && (
          <Stats {...{
            playerProvider,
            playerStatus,
            torrentStatus,
          }} />
        )}

        {!this.shouldShowControls() && (
          <div className={classes.player__controls}>
            <button
              className={'pct-btn pct-btn-trans pct-btn-outline pct-btn-round'}
              onClick={stop}>
              Cancel
            </button>
          </div>
        )}

        {this.shouldShowControls() && (
          <div className={classes.player__controls}>
            CONTROLS HERE
          </div>
        )}

        {playerProvider === PlayerConstants.PROVIDER_PLYR && this.renderVideo()}
      </div>
    )
  }
}

export default Player
