import React from 'react'
import classNames from 'classnames'

import type { Props } from './CoverTypes'
import QualitySwitch from './QualitySwitch'
import classes from './Cover.scss'

export const Cover = ({ poster, mode, torrent, torrents, setTorrent, play, showPlayInfo }: Props) => (
  <div className={classNames('col-sm-6', classes.cover)}>
    <div
      onClick={() => showPlayInfo ? play() : null}
      className={classes.cover__image}>

      <img
        className={classNames('animated fadeIn')}
        alt={'presentation'}
        role={'presentation'}
        src={poster} />

      <div className={classNames(
        classes['cover__image-overlay'],
        { [classes['cover__image-overlay--with-hover']]: showPlayInfo },
      )} />

      {showPlayInfo && (
        <i className={'ion-ios-play'} />
      )}

    </div>

    <QualitySwitch {...{
      mode,
      showPlayInfo,
      setTorrent,
      torrents,
      torrent,
    }} />

  </div>
)

export default Cover
