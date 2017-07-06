// @flow
import React, { Component } from 'react'
import VisibilitySensor from 'react-visibility-sensor'

import Header from '../Header'
import CardList from '../CardList'

import type { Props } from './HomeTypes'

export default class Home extends Component {

  props: Props

  handleOnVisibilityChange = (isVisible: boolean) => {
    const { isLoading, activeMode } = this.props

    if (isVisible && !isLoading) {
      const { getItems } = this.props
      const { page }     = this.props.modes[activeMode]

      getItems(activeMode, page)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { activeMode: newMode } = nextProps
    const { activeMode: oldMode } = this.props

    if (newMode !== oldMode) {
      window.scrollTo(0, 0)
      const { clearItems, switchMode, modes } = this.props

      clearItems()

      const { page } = modes[newMode]
      switchMode(newMode, page)
    }
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
