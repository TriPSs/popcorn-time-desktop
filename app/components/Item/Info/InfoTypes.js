// @flow
import type { DeviceType } from 'api/Player/StreamingProviders/StreamingTypes'
import type { ContentType } from 'api/Metadata/MetadataTypes'

export type Props = {
  item: ContentType,
  play: () => void,
  devices: Array<DeviceType>,
}

export type State = {
  trailerTooltipOpen: boolean,
}
