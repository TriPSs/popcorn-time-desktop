import React from 'react'
import classNames from 'classnames'

import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import type { Props } from './CoverTypes'
import QualitySwitch from './QualitySwitch'
import classes from './Cover.scss'

import itemClasses from '../Item.scss'

export default ({ poster, mode, torrent, torrents, setTorrent, play, showPlayInfo, visible }: Props) => (
  <div
    className={classNames(itemClasses.content__container, classes.cover)}
    style={{ visibility: visible ? 'inherit' : 'hidden' }}>
    <div
      role={'presentation'}
      onClick={() => (showPlayInfo && mode === MetadataConstants.TYPE_MOVIE ? play() : null)}
      className={classes.cover__image}>

      <img
        className={classNames('animated fadeIn')}
        alt={'presentation'}
        role={'presentation'}
        src={poster} />

      <div className={classNames(
        classes['cover__image-overlay'],
        { [classes['cover__image-overlay--with-hover']]: mode === MetadataConstants.TYPE_MOVIE && showPlayInfo },
      )} />

      {showPlayInfo && mode === MetadataConstants.TYPE_MOVIE && (
        <i className={'ion-ios-play'} />
      )}

    </div>

    {mode === MetadataConstants.TYPE_MOVIE && (
      <QualitySwitch {...{
        showPlayInfo,
        setTorrent,
        torrents,
        torrent,
      }} />
    )}

  </div>
)
