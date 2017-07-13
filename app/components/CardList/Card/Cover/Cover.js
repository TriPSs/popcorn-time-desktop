// @flow
import React from 'react'
import { withRouter } from 'react-router'
import classNames from 'classnames'

import placeHolderImage from 'images/posterholder.png'
import Bookmarked from 'components/Bookmarked'
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

      <div className={classes.cover__overlay}>
        <Bookmarked className={classes.overlay__bookmark} item={item} />

        <div
          onClick={() => history.push(`/item/${item.type}/${item.id}`)}
          className={classes.overlay__click} />
      </div>

    </div>

  </div>
)

export default withRouter(Cover)
