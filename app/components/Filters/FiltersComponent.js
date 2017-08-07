import React from 'react'
import classNames from 'classnames'

import classes from './Filters.scss'

export default class extends React.Component {

  render() {

    return (
      <div className={classes.container}>
        <div className={classNames(classes.filters, classes['filters--left'])}>
          <div className={classNames(classes.filter, classes['filter--active'])}>Trending</div>

          <div className={classNames(classes.filter)}>Popular</div>
        </div>

        <div className={classNames(classes.filters, classes['filters--right'])}>
          <div className={classes.filterHeading}>
            Filters
          </div>
          <div className={classNames(classes.filter)}>
            Comedy
            <i className={'ion-android-close'} />
          </div>
        </div>

      </div>
    )
  }
}
