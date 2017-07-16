// @flow
import type { EpisodeType } from 'api/Metadata/MetadataTypes'

export type Props = {
  episode: EpisodeType,
  toggleWatched: () => void,
}
