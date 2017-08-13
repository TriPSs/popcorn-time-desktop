import React from 'react'
import classNames from 'classnames'

import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap'

import type { Props, State } from './DevicesTypes'
import classes from './Devices.scss'

export class Devices extends React.Component {

  props: Props

  state: State = {
    open: false,
  }

  toggleOpen = () => {
    const { open } = this.state

    this.setState({
      open: !open,
    })
  }

  render() {
    const { devices, selectedDevice, player } = this.props
    const { open }                            = this.state

    return (
      <div className={classes.devices}>
        <Dropdown className={classNames({ open })} isOpen={open} toggle={this.toggleOpen}>
          <button
            onClick={() => this.toggleOpen()}
            className={classNames(
              'pct-btn pct-btn-trans pct-btn-outline pct-btn-round',
              classes.devices__button,
              { 'pct-btn-available': open },
            )}>
            <i className={classNames({
              'ion-ios-arrow-down': !open,
              'ion-ios-arrow-up'  : open,
            })} />

            {!selectedDevice && (
              <div>
                Popcorn Time
              </div>
            )}

            {selectedDevice && (
              <div>
                {selectedDevice.name}
              </div>
            )}

          </button>

          <DropdownMenu className={classes.dropdown__menu}>
            <DropdownItem onClick={() => player.selectDevice('Plyr')}>
              Popcorn Time
            </DropdownItem>

            {devices.map(castingDevice => (
              <DropdownItem
                key={castingDevice.name}
                onClick={() => player.selectDevice(castingDevice)}>
                {castingDevice.name}
              </DropdownItem>
            ))}

          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
}

export default Devices
