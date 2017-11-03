// @flow
import React from 'react'

import Loader from 'components/Loader'
import Header from 'components/Header'
import CardList from 'components/CardList'
import Fitlers from 'components/Filters'

import classes from './Home.scss'
import * as HomeConstants from './HomeConstants'
import type { Props } from './HomeTypes'
import NoConnection from './NoConnection'

export default class extends React.Component {

  props: Props

  cardListRef: Element

  constructor(props: Props) {
    super(props)

    // Temporary hack to preserve scroll position
    if (!global.pct) {
      global.pct = {
        moviesScrollTop   : 0,
        showsScrollTop    : 0,
        searchScrollTop   : 0,
        bookmarksScrollTop: 0,
      }
    }
  }

  componentDidMount() {
    const { match: { params: { mode } } } = this.props

    window.scrollTo(0, global.pct[`${mode}ScrollTop`])
    window.addEventListener('scroll', this.handlePageScroll)
  }

  componentWillReceiveProps(nextProps: Props) {
    const { match: { params: { mode: newMode } } } = nextProps
    const { match: { params: { mode: oldMode } } } = this.props

    // Save the scroll position
    global.pct[`${oldMode}ScrollTop`] = document.body.scrollTop

    if (newMode !== oldMode) {
      window.scrollTo(0, 0)

    } else if (newMode === oldMode) {
      const { location: { state: newFilters } } = nextProps
      const { location: { state: oldFilters } } = this.props

      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        const { clearItems, getItems, history } = this.props

        if (newMode === HomeConstants.MODE_SEARCH && !newFilters.keywords) {
          history.push('/movies')
        }

        clearItems(newMode)
        getItems(newMode, 1, newFilters)
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { match: { params: { mode: newMode } } } = this.props
    const { match: { params: { mode: oldMode } } } = prevProps

    if (oldMode !== newMode) {
      window.scrollTo(0, global.pct[`${newMode}ScrollTop`])
    }
  }

  componentWillUnmount() {
    if (document && document.body) {
      const { match: { params: { mode } } } = this.props

      global.pct[`${mode}ScrollTop`] = document.body.scrollTop
      window.removeEventListener('scroll', this.handlePageScroll)
    }
  }

  handlePageScroll = () => {
    if ((window.scrollY + 2000) > this.cardListRef.offsetHeight) {
      this.handleGetMoreItems(true)
    }
  }

  handleGetMoreItems = () => {
    const { match: { params: { mode } } } = this.props
    const { isLoading, modes, getItems } = this.props
    const { location: { state: filters } } = this.props
    const { page } = modes[mode]

    if ((mode === HomeConstants.MODE_BOOKMARKS || mode === HomeConstants.MODE_SEARCH) && page > 1) {
      return
    }

    if (!isLoading) {
      getItems(mode, page, filters)
    }
  }

  render() {
    const { match: { params: { mode } } } = this.props
    const { modes, isLoading, hasInternet } = this.props

    const { items } = modes[mode]

    if (!items.length && !isLoading && hasInternet) {
      this.handleGetMoreItems()
    }

    return (
      <div className={classes.home__container}>
        <Header />

        {hasInternet && (
          <Fitlers />
        )}

        {hasInternet && (
          <div
            ref={ref => this.cardListRef = ref}
            className={classes.home__cards}
            style={{ padding: 0 }}>
            <CardList items={modes[mode].items} />

            <Loader {...{ isLoading }} />
          </div>
        )}

        {!hasInternet && (
          <NoConnection
            getItems={this.handleGetMoreItems}
          />
        )}

      </div>
    )
  }
}
