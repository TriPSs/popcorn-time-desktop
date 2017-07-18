// @flow
import { PlayerProviderInterface } from '../PlayerInterface'
import type { DeviceType } from './StreamingTypes'

export interface StreamingInterface extends PlayerProviderInterface {

  devices: Array<DeviceType>

}
