// @flow
import MediaPlayer from 'api/Player'
import type { MetadataType } from 'api/Player/PlayerTypes'
import type { DeviceType } from 'api/Player/StreamingProviders/StreamingTypes'
import * as Constants from './PlayerConstants'
import * as Selectors from './PlayerSelectors'

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

export function foundDevices(devices) {
  return {
    type   : Constants.FOUND_DEVICES,
    payload: devices,
  }
}

export function getDevices() {
  return (dispatch) => {
    MediaPlayer.getDevices().then((deviceProviders) => {
      const devices = []
      deviceProviders.map(providers => providers.map(device => devices.push(device)))

      dispatch(foundDevices(devices))
    })
  }
}

export function selectDevice(device: DeviceType) {
  return (dispatch, getState) => {
    if (device !== Constants.PLAYER_PROVIDER_PLYR) {
      if (Selectors.getPlayerProvider(getState()) !== device.provider) {
        dispatch(updateProvider(device.provider))
      }

      MediaPlayer.selectDevice(device)

      return dispatch({
        type   : Constants.SELECT_DEVICE,
        payload: device,
      })

    } else {
      dispatch(updateProvider(device))

      return dispatch({
        type   : Constants.SELECT_DEVICE,
        payload: null,
      })
    }
  }
}

export function updateStatus(newStatus) {
  return {
    type   : Constants.UPDATE_PLAYER_STATUS,
    payload: newStatus,
  }
}

export function updateProvider(provider: string) {
  return (dispatch) => {
    MediaPlayer.updatePlayerProvider(provider)

    return dispatch({
      type   : Constants.UPDATE_PLAYER_TYPE,
      payload: {
        playerProvider: provider,
      },
    })
  }
}
