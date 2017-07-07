// @flow
import type { MetadataType } from 'api/players/PlayerProviderTypes'
import * as Constants from './PlayerConstants'

export function play(uri: string, metadata: MetadataType) {
  return {
    type   : Constants.PLAYER_PLAY,
    payload: {
      uri,
      metadata,
    },
  }
}

export function pause() {
  return {
    type: Constants.PLAYER_PAUSE,
  }
}

export function stop() {
  return {
    type: Constants.PLAYER_STOP,
  }
}

export function updatePlayerType(type: string) {
  return {
    type   : Constants.UPDATE_PLAYER_TYPE,
    payload: {
      playerType: type,
    },
  }
}
