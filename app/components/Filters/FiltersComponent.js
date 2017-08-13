import React from 'react'
import classNames from 'classnames'
import { withRouter } from 'react-router'

import classes from './Filters.scss'

export default withRouter(class extends React.Component {

  state = {
    sort: [
      'trending',
      'popularity',
      'last added',
      'year',
      'title',
      'rating',
    ],
  }

  applyFilter = (sort) => {
    const { match: { url }, history } = this.props

    history.replace({
      pathname: url,
      state   : {
        sort,
      },
    })
  }

  isFilterActive = (sort) => {
    const { location: { state: filters } } = this.props

    if ((!filters || !filters.sort)) {
      return sort === 'trending'
    }

    return filters.sort === sort
  }

  render() {

    const { sort } = this.state

    return (
      <div className={classes.container}>
        <div className={classNames(classes.filters, classes['filters--left'])}>

          {sort.map(sortOn => (
            <div
              key={sortOn}
              role={'presentation'}
              onClick={() => this.applyFilter(sortOn)}
              className={classNames(classes.filter, {
                [classes['filter--active']]: this.isFilterActive(sortOn),
              })}>
              {sortOn}
            </div>
          ))}
        </div>

        {/*<div className={classNames(classes.filters, classes['filters--right'])}>
      <div className={classes.filterHeading}>
        Filters
      </div>
      <div className={classNames(classes.filter)}>
        Comedy
        <i className={'ion-android-close'} />
      </div>
    </div>*/}

      </div>
    )
  }
})
