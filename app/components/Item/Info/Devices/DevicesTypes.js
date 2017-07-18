// @flow
import type { DeviceType } from 'api/Player/StreamingProviders/StreamingTypes'

export type Props = {
  devices: Array<DeviceType>,
  playerProvider: string,
}

export type State = {
  open: boolean,
}

