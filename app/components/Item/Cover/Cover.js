/**
 * Created by tycho on 10/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import type { Props } from './CoverTypes'
import QualitySwitch from './QualitySwitch'
import classes from './Cover.scss'

export const Cover = ({ poster, activeMode, torrent, torrents, setTorrent, play, showPlayInfo }: Props) => (
  <div className={classNames('col-sm-6', classes.cover)}>
    <div
      onClick={() => showPlayInfo ? play() : null}
      className={classes.cover__image}>
      <img
        alt={'presentation'}
        role={'presentation'}
        src={poster} />

      <div className={classNames(
        classes['cover__image-overlay'],
        { [classes['cover__image-overlay--with-hover']]: showPlayInfo && activeMode === 'movie' },
      )} />

      {showPlayInfo && activeMode === 'movie' && (
        <i className={'ion-ios-play'} />
      )}

    </div>

    {showPlayInfo && activeMode === 'movie' && (
      <QualitySwitch
        setTorrent={setTorrent}
        torrents={torrents}
        torrent={torrent} />
    )}
  </div>
)

export default Cover
