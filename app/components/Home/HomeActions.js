// @flow
import * as Constants from './HomeConstants'
import type { activeModeOptionsType, itemType } from './HomeTypes'

export function setActiveMode(activeMode: string, activeModeOptions?: activeModeOptionsType = {}) {
  return {
    type: Constants.SET_ACTIVE_MODE,
    activeMode,
    activeModeOptions,
  }
}

export function paginate(items: Array<itemType>) {
  return {
    type: Constants.PAGINATE,
    items,
  }
}

export function clearItems() {
  return {
    type: Constants.CLEAR_ITEMS,
  }
}

export function clearAllItems() {
  return {
    type: Constants.CLEAR_ALL_ITEMS,
  }
}

export function setLoading(isLoading: boolean) {
  return {
    type: Constants.SET_LOADING,
    isLoading,
  }
}

export function setCurrentPlayer(player: string) {
  return {
    type: Constants.SET_CURRENT_PLAYER,
    player,
  }
}
