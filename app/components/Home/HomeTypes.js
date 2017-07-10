// @flow

import type { MovieType, ShowType } from '../../api/metadata/MetadataTypes'

export type activeModeOptionsType = {
  searchQuery: ?string,
  [option: string]: number | boolean | string
};

export type Props = {

  setActiveMode: (mode: string, activeModeOptions: ?activeModeOptionsType) => void,
  getItems: (activeMode: string, page: ?number) => void,

  clearItems: () => void,
  activeMode: string,
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

  items: Array<itemType>,
  isLoading: boolean,
  infinitePagination: boolean
}
