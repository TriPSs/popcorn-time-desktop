import { REDUCER_NAME } from './PlayerConstants'

export const getUri            = state => state[REDUCER_NAME].uri
export const getItem           = state => state[REDUCER_NAME].item
export const getAction         = state => state[REDUCER_NAME].action
export const getStatus         = state => state[REDUCER_NAME].status
export const getProvider       = state => state[REDUCER_NAME].provider
export const getDevices        = state => state[REDUCER_NAME].devices
export const getSelectedDevice = state => state[REDUCER_NAME].selectedDevice
