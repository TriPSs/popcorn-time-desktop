import { REDUCER_NAME } from './WatchedConstants'

export const getMoviesWatched = state => state[REDUCER_NAME].moviesWatched

export default (state, prop) => state[REDUCER_NAME][prop]
