export const REDUCER_NAME = 'torrent'

export const STATUS_NONE        = `${REDUCER_NAME}.status.none`
export const STATUS_CONNECTING  = `${REDUCER_NAME}.status.connecting`
export const STATUS_BUFFERING   = `${REDUCER_NAME}.status.buffering`
export const STATUS_BUFFERED    = `${REDUCER_NAME}.status.buffered`
export const STATUS_DOWNLOADING = `${REDUCER_NAME}.status.downloading`
export const STATUS_DOWNLOADED  = `${REDUCER_NAME}.status.downloaded`

export const INITIAL_STATE = {
  status: STATUS_NONE,
}

export const UPDATE_STATUS = `${REDUCER_NAME}.events.status.change`
export const BUFFERING     = `${REDUCER_NAME}.events.buffering`
export const DOWNLOADING   = `${REDUCER_NAME}.events.downloading`
