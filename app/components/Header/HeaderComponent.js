// @flow
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import * as HomeConstants from 'components/Home/HomeConstants'
import classes from './Header.scss'

export class Header extends React.Component {

  state = {
    searchQuery: '',
  }

  handleSearchChange = event => this.setState({ searchQuery: event.target.value })

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const { setActiveMode } = this.props
      const { searchQuery }   = this.state

      setActiveMode('search', {
        searchQuery,
      })

      // browserHistory.replace('/search')
    }
  }

  render() {
    const { match: { params: { mode } } } = this.props

    return (
      <div className={classes.menu__container}>
        <ul className={classes.menu}>
          <li className={classNames(classes.menu__item, {
            [classes['menu__item--active']]: mode === HomeConstants.MODE_MOVIES,
          }, classes['menu__item-left'])}>
            <Link
              to={'/movies'}
              replace
              className="nav-link">
              Movies
            </Link>
          </li>

          <li className={classNames(classes.menu__item, {
            [classes['menu__item--active']]: mode === HomeConstants.MODE_SHOWS,
          }, classes['menu__item-left'])}>
            <Link
              className="nav-link"
              to={'/shows'}
              replace>
              TV Shows
            </Link>
          </li>

          <li className={classNames(classes.menu__item, {
            [classes['menu__item--active']]: mode === HomeConstants.MODE_BOOKMARKS,
          }, classes['menu__item-right'])}>
            <Link
              className="nav-link"
              to={'/bookmarks'}
              replace>
              <i className={'ion-heart'} />
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default withRouter(Header)
