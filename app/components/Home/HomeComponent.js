// @flow
import React from 'react'

import Loader from 'components/Loader'
import Header from 'components/Header'
import CardList from 'components/CardList'

import classes from './Home.scss'
import * as HomeConstants from './HomeConstants'
import type { Props } from './HomeTypes'

export class Home extends React.Component {

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

    } else if (newMode === oldMode && newMode === HomeConstants.MODE_SEARCH) {
      const { location: { state: newFilters } } = nextProps
      const { location: { state: oldFilters } } = this.props

      if (newFilters && newFilters.keywords !== oldFilters.keywords) {
        const { getItems, history } = this.props

        if (newFilters.keywords) {
          getItems(HomeConstants.MODE_SEARCH, 1, newFilters)

        } else {
          history.push('/movies')
        }
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
    if (!document.body) {
      throw new Error('"document" not defined. You are probably not running in the renderer process')
    }

    const { match: { params: { mode } } } = this.props

    global.pct[`${mode}ScrollTop`] = document.body.scrollTop
    window.removeEventListener('scroll', this.handlePageScroll)
  }

  handlePageScroll = () => {
    if ((window.scrollY + 2000) > this.cardListRef.offsetHeight) {
      this.handleGetMoreItems(true)
    }
  }

  handleGetMoreItems = () => {
    const { match: { params: { mode } } }  = this.props
    const { isLoading, modes, getItems }   = this.props
    const { location: { state: filters } } = this.props
    const { page }                         = modes[mode]

    if ((mode === HomeConstants.MODE_BOOKMARKS || mode === HomeConstants.MODE_SEARCH) && page > 1) {
      return
    }

    if (!isLoading) {
      getItems(mode, page, filters)
    }
  }

  render() {
    const { match: { params: { mode } } } = this.props
    const { modes, isLoading }            = this.props

    const { items } = modes[mode]

    if (!items.length) {
      this.handleGetMoreItems()
    }

    return (
      <div className={classes.home__container}>
        <Header />

        <div
          ref={ref => this.cardListRef = ref}
          className={classes.home__cards}
          style={{ padding: 0 }}>
          <CardList items={modes[mode].items} />

          <Loader {...{ isLoading }} />
        </div>


      </div>
    )
  }
}

export default Home
