// @flow
import React from 'react'
import * as MetadataConstants from 'api/Metadata/MetadataConstants'
import VisibilitySensor from 'react-visibility-sensor'

import Header from '../Header'
import CardList from '../CardList'

import * as Constants from './HomeConstants'
import type { Props } from './HomeTypes'

export class Home extends React.Component {

  props: Props

  constructor(props: Props) {
    super(props)

    // Temporary hack to preserve scroll position
    if (!global.pct) {
      global.pct = {
        moviesScrollTop: 0,
        showsScrollTop : 0,
        searchScrollTop: 0,
      }
    }
  }

  componentDidMount() {
    const { match: { params: { mode } } } = this.props

    window.scrollTo(0, global.pct[`${mode}ScrollTop`])
  }

  componentWillReceiveProps(nextProps: Props) {
    const { match: { params: { mode: newMode } } } = nextProps
    const { match: { params: { mode: oldMode } } } = this.props

    // Save the scroll position
    global.pct[`${oldMode}ScrollTop`] = document.body.scrollTop

    if (newMode !== oldMode) {
      window.scrollTo(0, 0)
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

    const { activeMode } = this.props

    global.pct[`${activeMode}ScrollTop`] = document.body.scrollTop
  }

  handleGetMoreItems = (isVisible: boolean = true) => {
    const { match: { params: { mode } } } = this.props
    const { isLoading, modes, getItems }  = this.props

    const { page } = modes[mode]
    if (mode === Constants.MODE_BOOKMARKS && page > 1) {
      return
    }

    if (isVisible && !isLoading) {
      getItems(mode, page)
    }
  }

  render() {
    const { match: { params: { mode } } } = this.props
    const { modes, isLoading }            = this.props

    return (
      <div className={'container-fluid'}>

        <Header />
        <div className={'container-fluid'}>
          <CardList items={modes[mode].items} isLoading={isLoading} />

          <VisibilitySensor onChange={this.handleGetMoreItems} />
        </div>
      </div>
    )
  }
}

export default Home
