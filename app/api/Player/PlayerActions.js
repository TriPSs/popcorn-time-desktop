// @flow
import MediaPlayer from 'api/Player'
import type { ContentType } from 'api/Metadata/MetadataTypes'
import type { DeviceType } from 'api/Player/StreamingProviders/StreamingTypes'
import * as Constants from './PlayerConstants'
import * as Selectors from './PlayerSelectors'

export function play(uri: string, item: ContentType) {
  return {
    type   : Constants.ACTION_PLAY,
    payload: {
      uri,
      item,
    },
  }
}

export function pause() {
  return {
    type: Constants.ACTION_PAUSE,
  }
}

export function stop() {
  return {
    type: Constants.ACTION_STOP,
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
    if (device !== Constants.PROVIDER_PLYR) {
      if (Selectors.getProvider(getState()) !== device.provider) {
        dispatch(updateProvider(device.provider))
      }

      MediaPlayer.selectDevice(device)

      return dispatch({
        type   : Constants.SELECT_DEVICE,
        payload: device,
      })
    }

    dispatch(updateProvider(device))

    return dispatch({
      type   : Constants.SELECT_DEVICE,
      payload: null,
    })

  }
}

export function updateStatus(newStatus) {
  return {
    type   : Constants.UPDATE_STATUS,
    payload: newStatus,
  }
}

export function updateProvider(provider: string) {
  return {
    type   : Constants.UPDATE_PROVIDER,
    payload: provider,
  }
}

export function videoAlmostDone() {
  return {
    type: Constants.VIDEO_ALMOST_DONE,
  }
}
