/**
 * @flow
 */
import React from 'react'
import classNames from 'classnames'

import type { Props } from './BackgroundTypes'
import QualtiySwitch from './QualitySwitch'
import classes from './Background.scss'

export const Background = ({
                             backgroundImage,
                             poster,
                             children,
                             activeMode,
                             torrent,
                             torrents,
                             setTorrent,
                             play,
                           }: Props) =>
  (
    <div
      className={classNames('col-sm-12', classes.background)}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}>
      <div className={classNames('col-sm-6', classes.background__image)}>
        <div className={classes.background__cover}>
          <img
            alt={'presentation'}
            role={'presentation'}
            src={poster} />

          <div className={classes['background__cover-overlay']} />

          <i
            onClick={play}
            className={'ion-ios-play'} />

        </div>

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
