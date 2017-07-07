/**
 * @flow
 */
import React from 'react'
import classNames from 'classnames'

import type { Props } from './BackgroundTypes'
import QualtiySwitch from './QualitySwitch'
import classes from './Background.scss'

export const Background = ({ backgroundImage, poster, children, activeMode, torrent, torrents, setTorrent }: Props) => (
  <div
    className={classNames('col-sm-12', classes.background)}
    style={{
      backgroundImage: [
        `-webkit-image-set(url(${backgroundImage}) 1x,`,
        `url(${backgroundImage}) 2x,`,
        `url(${backgroundImage}) 3x`,
      ].join(''),
    }}>
    <div className={classNames('col-sm-6', classes.background__image)}>
      <img
        alt={'presentation'}
        height={350}
        width={233}
        role={'presentation'}
        src={poster} />

      {activeMode === 'movie' && (
        <QualtiySwitch
          setTorrent={setTorrent}
          torrents={torrents}
          torrent={torrent} />
      )}
    </div>

    {children}

    <div className={classes.background__overlay} />

  </div>
)

export default Background
