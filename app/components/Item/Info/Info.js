/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import Rating from 'components/Rating'
import type { Props } from './InfoTypes'
import classes from './Info.scss'

export const Info = ({ item, play }: Props) => (
  <div className={classNames('col-sm-6', classes.info)}>
    <h1 className={'row-margin'}>
      {item.title}
    </h1>

    <div className={'row'}>
      {item.runtime.short && (
        <div className={'col-sm-3'}>
          <h6>
            {item.runtime.short}
          </h6>
        </div>
      )}

      {item.genres && (
        <div className={classNames('col-sm-9', classes.info__genres)}>
          <h6>
            {item.genres.join(', ')}
          </h6>
        </div>
      )}
    </div>

    <h6 className={classNames('row-margin', classes.info__summary)}>
      {item.summary}
    </h6>

    <div className={classNames('row-margin row-center', classes.info__details)}>
      {item.rating && (
        <Rating
          emptyStarColor={'rgba(255, 255, 255, 0.2)'}
          starColor={'white'}
          rating={item.rating}
        />
      )}

      <div>
        {item.year}
      </div>

      {item && item.certification && item.certification !== 'n/a' && (
        <div className={classes.info__certification}>
          {item.certification}
        </div>
      )}

      {item.trailer && item.trailer !== 'n/a' && (
        <div>
          <i
            className={'ion-videocamera'}
            onClick={() => play('youtube')}
          />
        </div>
      )}
    </div>
  </div>
)

export default Info
