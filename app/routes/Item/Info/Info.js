import React from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'

import * as MetdataConstants from 'api/Metadata/MetadataConstants'
import Bookmarked from 'components/Bookmarked'
import Watched from 'components/Watched'
import Rating from 'components/Rating'
import type { Props } from './InfoTypes'
import classes from './Info.scss'
import Devices from './Devices'

import itemClasses from '../Item.scss'

export default ({ item, play, mode }: Props) => (
  <div className={classNames(itemClasses.content__container, classes.info, classes[`info--${mode}`])}>
    <h1 className={classNames('row-margin', classes.info__title)}>
      {item.title}
    </h1>

    <div className={classNames('row', classes.info__basic)}>
      {item.runtime && item.runtime.short && (
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

    <div className={classNames('row-margin', classes.info__summary)}>
      {item.summary}
    </div>

    <div className={classes['info__details-container']}>
      <div className={classes.info__details}>
        <Bookmarked
          className={classes.info__bookmarked}
          item={item} />

        {item.type === MetdataConstants.TYPE_MOVIE && (
          <Watched
            className={classes.info__bookmarked}
            item={item} />
        )}
      </div>

      <div className={classes.info__details}>
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

        {item.status && (
          <div className={classes.info__status}>
            {item.status}
          </div>
        )}

        {item && item.certification && item.certification !== 'n/a' && (
          <div className={classes.info__certification}>
            {item.certification}
          </div>
        )}

        {item.trailer && item.trailer !== 'n/a' && (
          <div data-tip data-for={'trailer-tooltip'}>

            <i role={'presentation'} className={'ion-social-youtube-outline'} onClick={() => play('youtube')} />

            <ReactTooltip id={'trailer-tooltip'} effect={'solid'}>
              Trailer
            </ReactTooltip>
          </div>
        )}

        <Devices />
      </div>
    </div>
  </div>
)
