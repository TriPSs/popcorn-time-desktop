// @flow
import Butter from 'api/Butter'

import * as Constants from './HomeConstants'
import * as Selectors from './HomeSelectors'

import type { activeModeOptionsType } from './HomeTypes'

export function fetchItems() {
  return {
    type: Constants.FETCH_ITEMS,
  }
}

export function fetchedItems(items, type) {
  return {
    type   : Constants.FETCHED_ITEMS,
    payload: {
      items,
      type,
    },
  }
}

export function getItems(activeMode, page = 1) {
  return (dispatch) => {
    dispatch(fetchItems())

    switch (activeMode) {
      case Constants.MODE_MOVIES:
        return Butter.getMovies(page).then(movies => dispatch(fetchedItems(movies, activeMode)))

      case Constants.MODE_SHOWS:
        return Butter.getShows(page).then(shows => dispatch(fetchedItems(shows, activeMode)))

      case Constants.MODE_SEARCH:
        // TODO:: Get searchQuery from state
        // return Butter.getShows(page).then(shows => dispatch(fetchedItems(shows, activeMode)))

      case Constants.MODE_FAVORITES:
        // TODO:: Get bookmarks

      default:
        return null
    }
  }
}

export function setActiveMode(activeMode: string, activeModeOptions?: activeModeOptionsType = {}) {
  return {
    type   : Constants.SET_ACTIVE_MODE,
    payload: {
      activeMode,
      activeModeOptions,
    },
  }
}

export function clearItems() {
  return {
    type: Constants.CLEAR_ITEMS,
  }
}

export function switchMode(newMode, page) {
  return (dispatch, getState) => {
    const items = Selectors.getModes(getState())[newMode].items

    if (items.length > 0) {
      dispatch(fetchedItems([], newMode))

    } else {
      dispatch(getItems(newMode, page))
    }
  }
}
