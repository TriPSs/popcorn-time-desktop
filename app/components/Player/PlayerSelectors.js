import { REDUCER_NAME } from './PlayerConstants'

export const getUri            = state => state[REDUCER_NAME].uri
export const getPlayerAction   = state => state[REDUCER_NAME].playerAction
export const getPlayerStatus   = state => state[REDUCER_NAME].playerStatus
export const getPlayerProvider = state => state[REDUCER_NAME].playerProvider
export const getDevices        = state => state[REDUCER_NAME].devices
export const getSelectedDevice = state => state[REDUCER_NAME].selectedDevice
