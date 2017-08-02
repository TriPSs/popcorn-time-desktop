import React from 'react'
import { Tooltip } from 'reactstrap'
import classNames from 'classnames'

import * as MetdataConstants from 'api/Metadata/MetadataConstants'
import Bookmarked from 'components/Bookmarked'
import Watched from 'components/Watched'
import Rating from 'components/Rating'
import type { Props, State } from './InfoTypes'
import classes from './Info.scss'
import Devices from './Devices'

import itemClasses from '../Item.scss'

export class Info extends React.Component {

  props: Props

  state: State = {
    trailerTooltipOpen: false,
  }

  toggleTrailerTooltip = () => {
    const { trailerTooltipOpen } = this.state

    this.setState({
      trailerTooltipOpen: !trailerTooltipOpen,
    })
  }

  render() {
    const { item, play, mode }   = this.props
    const { trailerTooltipOpen } = this.state

    return (
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
              <div>
                <i
                  id={'trailerTooltip'}
                  className={'ion-social-youtube-outline'}
                  onClick={() => play('youtube')}
                />
                <Tooltip
                  placement={'top'}
                  isOpen={trailerTooltipOpen}
                  target={'trailerTooltip'}
                  toggle={this.toggleTrailerTooltip}>
                  Trailer
                </Tooltip>
              </div>
            )}

            <Devices />
          </div>
        </div>
      </div>
    )
  }
}

export default Info
