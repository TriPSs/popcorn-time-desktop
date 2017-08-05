// @flow
import React from 'react'
import classNames from 'classnames'

import Player from 'api/Player'
import * as PlayerConstants from 'api/Player/PlayerConstants'
import * as TorrentConstants from 'api/Torrent/TorrentConstants'

import type { Props } from './PlayerTypes'
import classes from './Player.scss'
import Stats from './Stats'
import Controls from './Controls'
import Progress from './Progress'

export default class extends React.Component {

  props: Props

  componentWillUnmount() {
    Player.destroy()
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

    return playerStatus !== PlayerConstants.STATUS_NONE
           && playerStatus !== PlayerConstants.STATUS_ENDED
           && playerAction !== PlayerConstants.ACTION_STOP
  }

  shouldShowControls = () => {
    const { playerProvider, playerStatus } = this.props

    if (playerProvider === PlayerConstants.PROVIDER_PLYR) {
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

        <video controls>
          <track kind={'captions'} />
        </video>
      </div>
    )
  }

  render() {
    const { playerProvider, playerStatus } = this.props
    const { stop, torrentStatus }          = this.props

    return (
      <div
        className={classNames({
          'animated fadeIn'          : !this.isHidden(),
          [classes['player--hidden']]: this.isHidden(),
        }, classes.player)}>

        {torrentStatus !== TorrentConstants.STATUS_NONE && (
          <Stats {...{
            playerProvider,
            playerStatus,
            torrentStatus,
            stop,
          }} />
        )}

        <div className={classNames(classes.player__controls, {
          'animated fadeIn': !this.isHidden(),
        })}>
          {this.shouldShowControls() && (
            <Controls />
          )}

          {this.shouldShowControls() && (
            <Progress />
          )}
        </div>

        {playerProvider === PlayerConstants.PROVIDER_PLYR && this.renderVideo()}
      </div>
    )
  }
}
