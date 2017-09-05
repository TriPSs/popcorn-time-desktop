// @flow
import MediaPlayer from 'api/Player'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { DeviceType } from 'api/Player/StreamingProviders/StreamingTypes'
import * as PlayerConstants from './PlayerConstants'
import * as PlayerSelectors from './PlayerSelectors'

export function play(uri: string, item: ContentType) {
  return {
    type   : PlayerConstants.ACTION_PLAY,
    payload: {
      uri,
      item,
    },
  }
}

export const togglePlay = () => (dispatch, getState) => {
  const playerStatus = PlayerSelectors.getStatus(getState())

  if (playerStatus === PlayerConstants.STATUS_PLAYING) {
    dispatch({
      type: PlayerConstants.ACTION_PAUSE,
    })
  } else {
    dispatch({
      type: PlayerConstants.ACTION_CONTINUE,
    })
  }
}

export function stop() {
  return {
    type: PlayerConstants.ACTION_STOP,
  }
}

export function foundDevices(devices) {
  return {
    type   : PlayerConstants.FOUND_DEVICES,
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
    if (device !== PlayerConstants.PROVIDER_PLYR) {
      if (PlayerSelectors.getProvider(getState()) !== device.provider) {
        dispatch(updateProvider(device.provider))
      }

      MediaPlayer.selectDevice(device)

      return dispatch({
        type   : PlayerConstants.SELECT_DEVICE,
        payload: device,
      })
    }

    dispatch(updateProvider(device))

    return dispatch({
      type   : PlayerConstants.SELECT_DEVICE,
      payload: null,
    })

  }
}

export function updateStatus(newStatus) {
  return {
    type   : PlayerConstants.UPDATE_STATUS,
    payload: newStatus,
  }
}

export function updateProvider(provider: string) {
  return {
    type   : PlayerConstants.UPDATE_PROVIDER,
    payload: provider,
  }
}

export function toggleControls(show) {
  return {
    type   : PlayerConstants.TOGGLE_CONTROLS,
    payload: show,
  }
}

