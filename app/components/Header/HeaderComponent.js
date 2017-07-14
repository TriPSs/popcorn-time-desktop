// @flow
import React from 'react'
import { withRouter } from 'react-router'
import classNames from 'classnames'

import { Link } from 'react-router-dom'

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
      <div className="row" style={{ height: 64 }}>
        <div className="col-sm-12">
          <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
            <div className="row">
              <div className="col-sm-6">
                <ul className="nav navbar-nav">
                  <li className={classNames('nav-item', {
                    active: mode === 'movies',
                  })}>
                    <Link
                      to={'/movies'}
                      replace
                      className="nav-link">
                      Movies
                    </Link>
                  </li>
                  <li className={classNames('nav-item', {
                    active: mode === 'shows',
                  })}>
                    <Link
                      className="nav-link"
                      to={'/shows'}
                      replace>
                      TV Shows
                    </Link>
                  </li>

                  <li className={classNames('nav-item', {
                    active: mode === 'bookmarks',
                  })}>
                    <Link
                      className="nav-link"
                      to={'/bookmarks'}
                      replace>
                      Bookmarks
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <div className="col-md-offset-3 col-md-3">
               <div className="input-group pull-right">
               <span className="input-group-addon" id="basic-addon1">
               <i className="ion-ios-search-strong" />
               </span>
               <input
               className="form-control"
               value={searchQuery}
               onKeyPress={this.handleKeyPress}
               onChange={this.handleSearchChange}
               type="text"
               placeholder="Search"
               />
               </div>
               </div>*/}
            </div>
          </nav>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
