// @flow

import type { contentType } from '../../api/metadata/MetadataProviderInterface';

export type activeModeOptionsType = {
  searchQuery: ? string,
  [option: string]: number | boolean | string
};

export type itemType = contentType;

export type Props = {
  actions: {
    setActiveMode: (mode: string, activeModeOptions: ?activeModeOptionsType) => void,
    paginate: (activeMode: string, activeModeOptions: ?activeModeOptionsType) => void,
    clearAllItems: () => void,
    setLoading: (isLoading: boolean) => void
  },
  activeMode: string,
  activeModeOptions: activeModeOptionsType,
  modes: {
    movies: {
      page: number,
      limit: number,
      items: {
        title: string,
        id: string,
        year: number,
        type: string,
        rating: number | 'n/a',
        genres: Array<string>
      }
    }
  },
  items: Array<itemType>,
  isLoading: boolean,
  infinitePagination: boolean
}
