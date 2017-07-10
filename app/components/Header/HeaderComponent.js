// @flow
import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { history as browserHistory } from 'store/configureStore'

type Props = {
  setActiveMode: (mode: string, options: ? { searchQuery: string }) => void,
  activeMode: string
};

export default class Header extends Component {

  props: Props

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

      browserHistory.replace('/item/search')
    }
  }

  render() {
    const { activeMode, setActiveMode } = this.props
    const { searchQuery }               = this.state

    return (
      <div className="row" style={{ height: 64 }}>
        <div className="col-sm-12">
          <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
            <div className="row">
              <div className="col-sm-6">
                <ul className="nav navbar-nav">
                  <li className={classNames('nav-item', {
                    active: activeMode === 'movies',
                  })}>
                    <Link
                      to={'/item/movies'}
                      replace
                      className="nav-link"
                      onClick={() => setActiveMode('movies')}>
                      Movies <span className="sr-only">(current)</span>
                    </Link>
                  </li>
                  <li className={classNames('nav-item', {
                    active: activeMode === 'shows',
                  })}>
                    <Link
                      className="nav-link"
                      to={'/item/shows'}
                      replace
                      onClick={() => setActiveMode('shows')}>
                      TV Shows
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-offset-3 col-md-3">
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
              </div>
            </div>
          </nav>
          {/* // HACK: Add spacing from top of page */}
          <nav className="navbar hidden navbar-dark bg-inverse">
            <div className="nav navbar-nav">
              <a className="nav-item nav-link active">
                Popcorn Time
                <span className="sr-only">(current)</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    )
  }
}
