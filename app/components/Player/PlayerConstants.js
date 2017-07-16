export const REDUCER_NAME = 'player'

export const PLAYER_ACTION_PLAY  = `${REDUCER_NAME}.play`
export const PLAYER_ACTION_PAUSE = `${REDUCER_NAME}.pause`
export const PLAYER_ACTION_STOP  = `${REDUCER_NAME}.stop`

export const PLAYER_PROVIDER_PLYR       = 'Plyr'
export const PLAYER_PROVIDER_CHROMECAST = 'Chromecast'

export const INITIAL_STATE = {
  uri           : null,
  item          : null,
  playerAction  : PLAYER_ACTION_STOP,
  playerStatus  : null,
  playerProvider: PLAYER_PROVIDER_PLYR,
  torrentStatus : null,
  devices       : [],
  selectedDevice: null,
}

export const UPDATE_PLAYER_TYPE   = `${REDUCER_NAME}.player.type.update`
export const UPDATE_PLAYER_STATUS = `${REDUCER_NAME}.status.update`
export const FOUND_DEVICES        = `${REDUCER_NAME}.devices.found`
export const SELECT_DEVICE        = `${REDUCER_NAME}.devices.select`
