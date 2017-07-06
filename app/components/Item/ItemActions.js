// @flow
import Butter from 'api/Butter'

import * as Constants from './ItemConstants'

export function fetchItem() {
  return {
    type: Constants.FETCH_ITEM,
  }
}

export function fetchedItem(item) {
  return {
    type   : Constants.FETCHED_ITEM,
    payload: item,
  }
}

export function getItem(itemId, activeMode) {
  return (dispatch) => {
    dispatch(fetchItem())

    switch (activeMode) {
      case 'movie':
        getMovie(itemId).then(movie => dispatch(fetchedItem(movie)))
        break

      case 'show':
        return dispatch(fetchedItem(getShow(itemId)))

      default:
        return null
    }

    return null
  }
}

export function getMovie(itemId) {
  // TODO:: Check if the movie is not already in the fetched movies

  return Butter.getMovie(itemId)
               .then(movie => movie)
}

export function getShow(itemId) {
  return Butter.getShow(itemId)
}
