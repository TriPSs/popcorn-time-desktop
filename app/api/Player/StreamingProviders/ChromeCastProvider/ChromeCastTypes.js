// @flow
export type Castv2DeviceType = {
  fullname: string,
  addresses: Array<string>,
  port: number,
  txtRecord: {
    fn: string
  }
}

export type BrowserType = {
  on: (event: string, cb: (device: Castv2DeviceType) => void) => void,
  start: () => void,
  stop: () => void
}
