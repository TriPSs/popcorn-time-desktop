// @flow
export type ContentType = {
  id: string,
  title: string,
  year: string,
  images: {
    poster: ImageType,
    fanart: ImageType,
  },
  type: string,
  rating: RatingType
}

export type MovieType = ContentType & {
  certification: string,
  summary: string,
  runtime: string,
  trailer: string,
  genres: string,
  rating: string,
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
  },
}

export type ShowType = ContentType & {}

export type TorrentType = {
  url: string,
  seed: number,
  peer: number,
  size: number,
  filesize: string,
  provider: string,
  health: {
    text: string,
    number: number,
  }
}

export type ImageType = {
  full: string,
  medium: string,
  thumb: string,
}

export type RatingType = {
  stars: number,
}

export type RuntimeType = {
  full: string,
  hours: number,
  minutes: number
}

type seasonType = {}

type episodeType = seasonType & {}

export type certificationType = 'G' | 'PG' | 'PG-13' | 'R' | 'n/a'

export type imagesType = {}

//  sort?: 'ratings' | 'popular' | 'trending',
export type optionsType = {}
