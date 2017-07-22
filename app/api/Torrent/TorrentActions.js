import * as Constants from './TorrentConstants'

export function updateStatus(newStatus, { uri = {}, item = {} }) {
  return {
    type   : Constants.UPDATE_STATUS,
    payload: {
      newStatus,
      uri,
      item,
    },
  }
}

export function buffering(progress) {
  return {
    type   : Constants.BUFFERING,
    payload: progress,
  }
}

export function downloading(progress) {
  return {
    type   : Constants.DOWNLOADING,
    payload: progress,
  }
}
