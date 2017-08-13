// @flow
import type { MovieType, ShowType } from 'api/Metadata/MetadataTypes'

export type activeModeOptionsType = {
  searchQuery: ?string,
  [option: string]: number | boolean | string
};

export type Props = {

  setActiveMode: (mode: string, activeModeOptions: ?activeModeOptionsType) => void,
  getItems: (mode: string, page: ?number) => void,

  clearItems: () => void,
  activeModeOptions: activeModeOptionsType,
  modes: {
    movies: {
      page: number,
      limit: number,
      items: Array<MovieType>
    },
    shows: {
      page: number,
      limit: number,
      items: Array<ShowType>
    }
  },

  isLoading: boolean,
  infinitePagination: boolean
}
