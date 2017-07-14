import React from 'react'
import { Tooltip } from 'reactstrap'
import classNames from 'classnames'

import Rating from 'components/Rating'
import type { Props, State } from './InfoTypes'
import classes from './Info.scss'
import Devices from './Devices'

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
    const { item, play, isReady } = this.props
    const { trailerTooltipOpen }  = this.state

    return (
      <div className={classNames('col-sm-6', classes.info)}>
        <h1 className={classNames('row-margin', classes.info__title)}>
          {isReady && item && item.title}
        </h1>

        <div className={classNames('row', classes.info__basic)}>
          {isReady && item.runtime && item.runtime.short && (
            <div className={'col-sm-3'}>
              <h6>
                {isReady && item && item.runtime.short}
              </h6>
            </div>
          )}

          {isReady && item.genres && (
            <div className={classNames('col-sm-9', classes.info__genres)}>
              <h6>
                {item.genres.join(', ')}
              </h6>
            </div>
          )}
        </div>

        <div className={classNames('row-margin', classes.info__summary)}>
          {isReady && item.summary}
        </div>

        <div className={classNames('row-margin row-center', classes.info__details)}>
          {isReady && item.rating && (
            <Rating
              emptyStarColor={'rgba(255, 255, 255, 0.2)'}
              starColor={'white'}
              rating={item.rating}
            />
          )}

          <div>
            {isReady && item.year}
          </div>

          {isReady && item.certification && item.certification !== 'n/a' && (
            <div className={classes.info__certification}>
              {item.certification}
            </div>
          )}

          {isReady && item.trailer && item.trailer !== 'n/a' && (
            <div>
              <i
                id={'trailerTooltip'}
                className={'ion-videocamera'}
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

          {isReady && (
            <Devices />
          )}
        </div>
      </div>
    )
  }
}

export default Info
