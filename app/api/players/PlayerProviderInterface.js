// @flow
import type { MetadataType } from './PlayerProviderTypes'

export interface PlayerProviderInterface {

  load: (uri: string, metadata: MetadataType) => Promise<void>,

  play: (uri: ?string, metadata: ?MetadataType) => Promise<void>,

  pause: () => Promise<void>,

  stop: () => Promise<void>,

  /*provider: string,

  supportedFormats: Array<string>,

  supportsSubtitles: boolean,

  svgIconFilename: string,

  contentUrl: string,

  port: number,

  constructor: () => void,

  restart: () => Promise<void>,

  destroy: () => Promise<void>,*/

}
