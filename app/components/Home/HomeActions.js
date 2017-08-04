// @flow
import Butter from 'api/Butter'
import Database from 'api/Database'

import * as Constants from './HomeConstants'
import * as Selectors from './HomeSelectors'

export function fetchItems() {
  return {
    type: Constants.FETCH_ITEMS,
  }
}

export function fetchedItems(items, mode) {
  return {
    type   : Constants.FETCHED_ITEMS,
    payload: {
      items,
      mode,
    },
  }
}

export function getItems(mode, page = 1) {
  return (dispatch, getState) => {
    dispatch(fetchItems())

    const { filters } = Selectors.getModes(getState())[mode]

    switch (mode) {
      case Constants.MODE_MOVIES:
        return Butter.getMovies(page, filters).then(movies => dispatch(fetchedItems(movies, mode)))

      case Constants.MODE_SHOWS:
        return Butter.getShows(page, filters).then(shows => dispatch(fetchedItems(shows, mode)))

      case Constants.MODE_BOOKMARKS:
        return Database.movies.getAll().then(({ docs: movies }) => {
          dispatch(fetchedItems(movies, mode))

          return Database.shows.getAll().then(({ docs: shows }) => dispatch(fetchedItems(shows, mode)))
        })

      case Constants.MODE_SEARCH:
      // TODO:: Get searchQuery from state
      // return Butter.getShows(page).then(shows => dispatch(fetchedItems(shows, activeMode)))
        return null

      default:
        return null
    }
  }
}
