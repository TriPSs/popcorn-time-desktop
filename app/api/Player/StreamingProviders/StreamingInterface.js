// @flow
import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { DeviceType } from './StreamingTypes'
import { PlayerProviderInterface } from '../PlayerInterface'

export interface StreamingInterface extends PlayerProviderInterface {

  provider: string,

  devices: Array<DeviceType>,

  status: string,

  getDevices: () => Promise,

  play: (uri: string, item: ContentType) => void,

  togglePlay: () => void,

  stop: () => void,

  destroy: () => void,

}
