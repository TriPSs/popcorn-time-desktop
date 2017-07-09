export const REDUCER_NAME = 'player'

export const PLAYER_ACTION_PLAY  = `${REDUCER_NAME}.play`
export const PLAYER_ACTION_PAUSE = `${REDUCER_NAME}.pause`
export const PLAYER_ACTION_STOP  = `${REDUCER_NAME}.stop`

export const UPDATE_PLAYER_STATUS = `${REDUCER_NAME}.status.update`

export const PLAYER_TYPE_PLYR       = 'plyr'
export const PLAYER_TYPE_CHROMECAST = 'chromecast'

export const INITIAL_STATE = {
  uri          : null,
  metadata     : null,
  playerAction : PLAYER_ACTION_STOP,
  playerStatus : null,
  playerType   : PLAYER_TYPE_PLYR,
  torrentStatus: null,
}

export const UPDATE_PLAYER_TYPE = `${REDUCER_NAME}.player.type.update`
