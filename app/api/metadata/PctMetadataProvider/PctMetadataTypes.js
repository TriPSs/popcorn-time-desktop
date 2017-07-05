// @flow
export type imageType = {
  poster: string,
  fanart: string,
  banner: string,
}

export type ratingType = {
  percentage: number,
  watching: number,
  votes: number,
  loved: number,
  hated: number,
}

export type movieType = {
  _id: string,
  imdb_id: string,
  title: string,
  year: string,
  synopsis: string,
  runtime: string,
  released: number,
  trailer: string,
  certification: string,
  torrents: {
    en: {
      '1080p': torrentType,
      '720p': torrentType,
    }
  },
  genres: Array<string>
  images: imageType,
  rating: ratingType
}

export type showType = {
  _id: string,
  imdb_id: string,
  tvdb_id: string,
  title: string,
  year: string,
  slug: string,
  num_seasons: number,
  images: imageType,
  rating: ratingType
}

export type showDetailType = showType & {
  synopsis: string,
  runtime: string,
  country: string,
  network: string,
  air_day: string,
  air_time: string,
  status: string,
  last_updated: number,
  __v: number,
  episodes: [],
  genres: Array<string>
}

export type torrentType = {
  url: string,
  seed: number,
  peer: number,
  size: number,
  filesize: string,
  provider: string,
}
