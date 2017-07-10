import { REDUCER_NAME } from './HomeConstants'

export const getActiveMode        = state => state[REDUCER_NAME].activeMode
export const getActiveModeOptions = state => state[REDUCER_NAME].activeModeOptions
export const getModes             = state => state[REDUCER_NAME].modes
export const getItems             = state => state[REDUCER_NAME].items
export const getIsLoading         = state => state[REDUCER_NAME].isLoading
