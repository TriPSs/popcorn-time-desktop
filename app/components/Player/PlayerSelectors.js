import { REDUCER_NAME } from './PlayerConstants'

export const getUri          = state => state[REDUCER_NAME].uri
export const getMetadata     = state => state[REDUCER_NAME].metadata
export const getPlayerAction = state => state[REDUCER_NAME].playerAction
export const getPlayerStatus = state => state[REDUCER_NAME].playerStatus
export const getPlayerType   = state => state[REDUCER_NAME].playerType
