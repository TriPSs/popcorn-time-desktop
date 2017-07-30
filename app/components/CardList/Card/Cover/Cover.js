// @flow
import React from 'react'
import { withRouter } from 'react-router'
import classNames from 'classnames'

import * as MetdataConstants from 'api/Metadata/MetadataConstants'
import placeHolderImage from 'images/posterholder.png'
import Bookmarked from 'components/Bookmarked'
import Watched from 'components/Watched'
import type { Props } from './CoverTypes'
import classes from './Cover.scss'

export const Cover = ({ item, history }: Props) => (
  <div
    className={classNames(classes.cover, 'animated', 'fadeIn')}
    style={{
      backgroundImage: `url(${placeHolderImage})`,
    }}>

    <div
      className={classNames(classes.cover, 'animated', 'fadeIn')}
      style={{
        backgroundImage: `url(${item.images.poster.thumb})`,
      }}>

      <div className={classNames(classes.cover__overlay, {
        [classes['cover__overlay--watched']]: item.watched,
      })}>
        <Bookmarked className={classes.overlay__bookmark} item={item} />

        {item.type === MetdataConstants.TYPE_MOVIE && (
          <Watched
            className={classes.overlay__watched}
            item={item} />
        )}

        <div
          onClick={() => history.push(`/${item.type}/${item.id}`)}
          className={classes.overlay__click} />
      </div>

    </div>

  </div>
)

export default withRouter(Cover)
