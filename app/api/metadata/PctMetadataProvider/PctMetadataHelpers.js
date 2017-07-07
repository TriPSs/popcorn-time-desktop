import type { ImageType, TorrentType, RatingType } from './PctMetadataTypes'

export const formatImages = (images: ImageType) => {
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
      return {
        text  : 'decent',
        color : '#FF9800',
        number: 1,
      }
    }

    if (ratio > 1 && seed >= 100) {
      return {
        text  : 'healthy',
        color : '#4CAF50',
        number: 2,
      }
    }

    return {
      text  : 'poor',
      color : '#F44336',
      number: 0,
    }
  }

  const formatTorrent = (torrent: TorrentType, quality: string) => ({
    ...torrent,
    quality,
    health: {
      ...getHealth(torrent.seed, torrent.peer),
    },
  })

  return {
    '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p'], '1080p'),
    '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p'], '720p'),
  }
}

export const formatRating = (rating: RatingType) => ({
  stars: (rating.percentage / 100) * 5,
})
