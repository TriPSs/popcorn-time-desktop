// @flow
import type { MetadataType } from 'api/players/PlayerProviderTypes'
import * as Constants from './PlayerConstants'

export function play(uri: string, metadata: MetadataType) {
  return {
    type   : Constants.PLAYER_ACTION_PLAY,
    payload: {
      uri,
      metadata,
    },
  }
}

export function pause() {
  return {
    type: Constants.PLAYER_ACTION_PAUSE,
  }
}

export function stop() {
  return {
    type: Constants.PLAYER_ACTION_STOP,
  }
}

export function updateStatus(newStatus) {
  return {
    type   : Constants.UPDATE_PLAYER_STATUS,
    payload: newStatus,
  }
}

export function updateType(type: string) {
  return {
    type   : Constants.UPDATE_PLAYER_TYPE,
    payload: {
      playerType: type,
    },
  }
}
