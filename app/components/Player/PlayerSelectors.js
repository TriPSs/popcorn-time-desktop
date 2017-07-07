import { REDUCER_NAME } from './PlayerConstants'

export const getUri        = state => state[REDUCER_NAME].uri
export const getMetadata   = state => state[REDUCER_NAME].metadata
export const getStatus     = state => state[REDUCER_NAME].status
export const getPlayerType = state => state[REDUCER_NAME].playerType
