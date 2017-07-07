// @flow
import React, { Component } from 'react'
import VisibilitySensor from 'react-visibility-sensor'

import Header from '../Header'
import CardList from '../CardList'

import type { Props } from './HomeTypes'

export default class Home extends Component {

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

  handleOnVisibilityChange = (isVisible: boolean) => {
    const { isLoading, activeMode } = this.props

    if (isVisible && !isLoading) {
      const { getItems } = this.props
      const { page }     = this.props.modes[activeMode]

      getItems(activeMode, page)
    }
  }

  componentDidMount() {
    const { activeMode } = this.props

    window.scrollTo(0, global.pct[`${activeMode}ScrollTop`])
  }

  componentWillReceiveProps(nextProps: Props) {
    const { activeMode: newMode } = nextProps
    const { activeMode: oldMode } = this.props

    // Save the scroll position
    global.pct[`${oldMode}ScrollTop`] = document.body.scrollTop

    if (newMode !== oldMode) {
      window.scrollTo(0, 0)
      const { clearItems, switchMode, modes } = this.props

      clearItems()

      const { page } = modes[newMode]
      switchMode(newMode, page)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { activeMode } = this.props
    const { oldMode }    = prevProps

    if (oldMode !== activeMode) {
      window.scrollTo(0, global.pct[`${activeMode}ScrollTop`])
    }
  }

  componentWillUnmount() {
    if (!document.body) {
      throw new Error('"document" not defined. You are probably not running in the renderer process')
    }

    const { activeMode } = this.props

    global.pct[`${activeMode}ScrollTop`] = document.body.scrollTop
  }

  render() {
    const { items, isLoading } = this.props

    return (
      <div className={'container-fluid'}>

        <Header />

        <CardList items={items} isLoading={isLoading} />
        <VisibilitySensor onChange={this.handleOnVisibilityChange} />

      </div>
    )
  }
}
