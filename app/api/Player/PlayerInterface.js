// @flow
import type { MetadataType } from './PlayerTypes'

export interface PlayerProviderInterface {

  provider: string,

  supportsSubtitles: boolean,

  status: string,

  play: (uri: string, metadata: MetadataType) => Promise<void>,

  pause: () => Promise<void>,

  stop: () => Promise<void>,

  isPlaying: () => boolean,

  getDevices: (timeout: number) => Promise<void>,

  destroy: () => Promise<void>,

}
