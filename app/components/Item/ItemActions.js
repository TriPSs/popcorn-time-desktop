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
        return Butter.getMovie(itemId).then(movie => dispatch(fetchedItem(movie)))

      case 'show':
        return Butter.getShow(itemId).then(show => dispatch(fetchedItem(show)))

      default:
        return null
    }
  }
}
