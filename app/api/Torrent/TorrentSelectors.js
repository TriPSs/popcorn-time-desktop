import { REDUCER_NAME } from './TorrentConstants'

export const getStatus = state => state[REDUCER_NAME].status
export const getStats  = state => state[REDUCER_NAME].stats
