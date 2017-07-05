import type { imageType, torrentType } from './PctMetadataTypes'

export const formatImages = (images: imageType) => {
  const replaceWidthPart = (uri: string, replaceWith: string) => uri.replace('w500', replaceWith)

  return {
    poster: {
      full  : replaceWidthPart(images.poster, 'original'),
      medium: replaceWidthPart(images.poster, 'w780'),
      thumb : replaceWidthPart(images.poster, 'w342'),
    },
    fanart: {
      full  : replaceWidthPart(images.fanart, 'original'),
      medium: replaceWidthPart(images.fanart, 'w780'),
      thumb : replaceWidthPart(images.fanart, 'w342'),
    },
  }
}

export const formatTorrents = (torrents) => {
  const getHealth = (seed, peer) => {
    const ratio = seed && !!peer ? seed / peer : seed

    if (ratio > 1 && seed >= 50 && seed < 100) {
      return 'decent'
    }

    if (ratio > 1 && seed >= 100) {
      return 'healthy'
    }

    return 'poor'

    return {
      health: {
        text: 'poor',
        number: 0,
      }
    }
  }

  const formatTorrent = (torrent: torrentType) => ({
    ...torrent,
    health: getHealth(torrent.seed, torrent.peer),
  })

  return {
    '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p']),
    '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p']),
  }
}
