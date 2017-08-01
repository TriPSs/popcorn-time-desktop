import React from 'react'
import classNames from 'classnames'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'

import type { Props } from './CoverTypes'
import QualitySwitch from './QualitySwitch'
import classes from './Cover.scss'

export const Cover = ({ poster, mode, torrent, torrents, setTorrent, play, showPlayInfo }: Props) => (
  <div className={classNames('col-sm-6', classes.cover)}>
    <div
      onClick={() => showPlayInfo && mode === MetadataConstants.TYPE_MOVIE ? play() : null}
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

    {mode === MetadataConstants.TYPE_MOVIE && (
      <QualitySwitch
        showPlayInfo={showPlayInfo}
        setTorrent={setTorrent}
        torrents={torrents}
        torrent={torrent} />
    )}
  </div>
)

export default Cover
