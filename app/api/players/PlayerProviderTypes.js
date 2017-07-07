// @flow
export type DeviceType = {
  id: string,
  name: string,
  address: string,
  port: number
}

export type MetadataType = {
  title: string,
  type: ?string,
  image: {
    poster: string
  },
  autoPlay: ?boolean,
}
