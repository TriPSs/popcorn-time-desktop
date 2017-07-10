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
  rating: RatingType,
  summary: string,
  genres: string,
  runtime: string,
}

export type MovieType = ContentType & {
  certification: string,
  trailer: string,
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
  },
}

export type ShowType = ContentType & {
  genres: string,
  seasons: Array<SeasonType>,
}

export type SeasonType = {
  title: string,
  summary: string,
  number: number,
  episodes: Array<EpisodeType>,
}

export type EpisodeType = {
  id: string,
  title: string,
  number: number,
  summary: string,
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
    '420p': TorrentType,
  },
}

export type TorrentType = {
  url: string,
  seeds: number,
  peers: number,
  size: number,
  filesize: string,
  provider: string,
  health: {
    text: string,
    number: number,
    color: string,
  }
}

export type ImageType = {
  full: string,
  high: string,
  medium: string,
  thumb: string,
}

export type RatingType = {
  stars: number,
  percentage: number,
}

export type RuntimeType = {
  full: string,
  hours: number,
  minutes: number
}

export type filterType = {
  sort?:  'populaity' | 'trending',
}
