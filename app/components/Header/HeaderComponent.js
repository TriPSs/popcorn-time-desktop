// @flow
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import logoImage from 'images/logo.png'
import * as HomeConstants from 'routes/Home/HomeConstants'
import classes from './Header.scss'
import type { Props } from './HeaderTypes'

export default withRouter(class extends React.Component {

  props: Props

  state = {
    searchQuery: '',
  }

  handleSearchChange = event => this.setState({ searchQuery: event.target.value })

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSearch()
    }
  }

  handleSearch = () => {
    const { history }     = this.props
    const { searchQuery } = this.state

    history.replace({
      pathname: '/search',
      state   : {
        keywords: searchQuery,
      },
    })
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

          <li className={classNames(classes.menu__item, classes['menu__item-logo'])}>
            <img src={logoImage} className={'animated fadeIn'} alt={'Popcorn Time'} />
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

          <li className={classNames(classes.menu__item, classes['menu__item-search'], {
            [classes['menu__item--active']]: mode === HomeConstants.MODE_SEARCH,
          }, classes['menu__item-right'])}>

            <input
              type={'text'}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleKeyPress}
              placeholder={'Search'} />

            <i
              role={'presentation'}
              onClick={this.handleSearch}
              className={'ion-search'} />

          </li>

        </ul>
      </div>
    )
  }
})
