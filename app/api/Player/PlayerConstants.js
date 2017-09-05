export const REDUCER_NAME = 'player'

export const STATUS_NONE       = `${REDUCER_NAME}.status.none`
export const STATUS_PLAYING    = `${REDUCER_NAME}.status.playing`
export const STATUS_BUFFERING  = `${REDUCER_NAME}.status.BUFFERING`
export const STATUS_CONNECTING = `${REDUCER_NAME}.status.connecting`
export const STATUS_PAUSED     = `${REDUCER_NAME}.status.paused`
export const STATUS_ENDED      = `${REDUCER_NAME}.status.ended`

export const ACTION_PLAY     = `${REDUCER_NAME}.play`
export const ACTION_CONTINUE = `${REDUCER_NAME}.continue`
export const ACTION_PAUSE    = `${REDUCER_NAME}.pause`
export const ACTION_STOP     = `${REDUCER_NAME}.stop`

export const PROVIDER_PLYR       = 'Plyr'
export const PROVIDER_CHROMECAST = 'Chromecast'

export const INITIAL_STATE = {
  uri           : null,
  item          : null,
  action        : ACTION_STOP,
  status        : STATUS_NONE,
  provider      : PROVIDER_PLYR,
  devices       : [],
  selectedDevice: null,
  showControls  : false,
}

export const UPDATE_PROVIDER = `${REDUCER_NAME}.player.type.update`
export const UPDATE_STATUS   = `${REDUCER_NAME}.status.update`
export const FOUND_DEVICES   = `${REDUCER_NAME}.devices.found`
export const SELECT_DEVICE   = `${REDUCER_NAME}.devices.select`
export const TOGGLE_CONTROLS = `${REDUCER_NAME}.player.controls`
export const LOAD_ITEM       = `${REDUCER_NAME}.load.item`
