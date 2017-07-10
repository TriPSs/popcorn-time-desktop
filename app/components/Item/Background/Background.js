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
                             showPlayInfo,
                           }: Props) =>
  (
    <div
      className={classNames('col-sm-12', classes.background__container)}>
      <div className={classNames('col-sm-6', classes.background__image)}>
        <div className={classes.background__cover}>
          <img
            alt={'presentation'}
            role={'presentation'}
            src={poster} />

          <div className={classes['background__cover-overlay']} />

          {showPlayInfo && activeMode === 'movie' && (
            <i
              onClick={play}
              className={'ion-ios-play'} />
          )}

        </div>

        {showPlayInfo && activeMode === 'movie' && (
          <QualtiySwitch
            setTorrent={setTorrent}
            torrents={torrents}
            torrent={torrent} />
        )}
      </div>

      {children}

      <div className={classes.background__poster} style={{ backgroundImage: `url(${backgroundImage})` }}>

        <div className={classes.background__overlay} />
      </div>
    </div>
  )

export default Background
