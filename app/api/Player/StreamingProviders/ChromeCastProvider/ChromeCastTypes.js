// @flow
import type { DeviceType } from '../StreamingTypes'

export type ChromeCastType = DeviceType & {

  play: (url: string, opts: Object, cb: () => void) => void,

  pause: (cb: () => void) => void,

  resume: (cb: () => void) => void,

  stop: (cb: () => void) => void,

  seek: (cb: () => void) => void,

  status: (cb: () => void) => void,

  on: (event: string, cb: () => void) => void,

}

export type ChromeCastApiType = {

  update: () => void,

  on: (event: string, player: (player: ChromeCastType) => void) => void,

}
