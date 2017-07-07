export const REDUCER_NAME = 'player'

export const PLAYER_PLAY  = `${REDUCER_NAME}.play`
export const PLAYER_PAUSE = `${REDUCER_NAME}.pause`
export const PLAYER_STOP  = `${REDUCER_NAME}.stop`
export const PLAYER_LOAD  = `${REDUCER_NAME}.load`

export const PLAYER_STATUS_PLAYING = `${REDUCER_NAME}.playing`
export const PLAYER_STATUS_PAUSED  = `${REDUCER_NAME}.paused`
export const PLAYER_STATUS_ENDED   = `${REDUCER_NAME}.ended`

export const PLAYER_TYPE_PLYR       = 'plyr'
export const PLAYER_TYPE_CHROMECAST = 'chromecast'

export const INITIAL_STATE = {
  uri       : null,
  metadata  : null,
  status    : PLAYER_STOP,
  playerType: PLAYER_TYPE_PLYR,
}

export const UPDATE_PLAYER_TYPE = `${REDUCER_NAME}.player.type.update`
