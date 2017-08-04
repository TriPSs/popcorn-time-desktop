import { REDUCER_NAME } from './BookmarkedConstants'

export const getBookmarkes = state => state[REDUCER_NAME].bookmarks

export default (state, prop) => state[REDUCER_NAME][prop]
