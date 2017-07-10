import type { ImageType, TorrentType, RatingType } from './PctMetadataTypes'

export const formatImages = (images: ImageType) => {
  const replaceWidthPart = (uri: string, replaceWith: string) => uri.replace('w500', replaceWith)

  return {
    poster: {
      full  : replaceWidthPart(images.poster, 'original'),
      high  : replaceWidthPart(images.poster, 'w1280'),
      medium: replaceWidthPart(images.poster, 'w780'),
      thumb : replaceWidthPart(images.poster, 'w342'),
    },
    fanart: {
      full  : replaceWidthPart(images.fanart, 'original'),
      high  : replaceWidthPart(images.fanart, 'w1280'),
      medium: replaceWidthPart(images.fanart, 'w780'),
      thumb : replaceWidthPart(images.fanart, 'w342'),
    },
  }
}

export const formatTorrents = (torrents, type = 'movie') => {
  const getHealth = (seeds, peers) => {
    const ratio = seeds && !!peers ? seeds / peers : seeds

    // Normalize the data. Convert each to a percentage
    // Ratio: Anything above a ratio of 5 is good
    const normalizedRatio = Math.min(ratio / 5 * 100, 100)
    // Seeds: Anything above 30 seeds is good
    const normalizedSeeds = Math.min(seeds / 30 * 100, 100)

    // Weight the above metrics differently
    // Ratio is weighted 60% whilst seeders is 40%
    const weightedRatio = normalizedRatio * 0.6
    const weightedSeeds = normalizedSeeds * 0.4
    const weightedTotal = weightedRatio + weightedSeeds

    // Scale from [0, 100] to [0, 3]. Drops the decimal places
    const scaledTotal = ((weightedTotal * 3) / 100) | 0

    if (scaledTotal === 1) {
      return {
        text  : 'decent',
        color : '#FF9800',
        number: 1,
      }

    } else if (scaledTotal >= 2) {
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
      ...getHealth(torrent.seed || torrent.seeds, torrent.peer || torrent.peers),
    },
    seeds : torrent.seed || torrent.seeds,
    peers : torrent.peer || torrent.peers,
  })

  if (type === 'movie') {
    return {
      '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p'], '1080p'),
      '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p'], '720p'),
    }
  }

  return {
    '1080p': !torrents['1080p'] ? null : formatTorrent(torrents['1080p'], '1080p'),
    '720p' : !torrents['720p'] ? null : formatTorrent(torrents['720p'], '720p'),
    '480p' : !torrents['480p'] ? null : formatTorrent(torrents['480p'], '480p'),
  }
}

export const formatRating = (rating: RatingType) => ({
  stars: (rating.percentage / 100) * 5,
  ...rating,
})

export const formatShowEpisodes = (episodes) => {
  let seasons = []

  episodes.map((episode) => {
    if (!seasons[episode.season]) {
      seasons[episode.season] = []
    }

    seasons[episode.season][episode.episode] = {
      summary : episode.overview,
      season  : episode.season,
      number  : episode.season,
      episode : episode.episode,
      torrents: formatTorrents(episode.torrents, 'show'),
    }
  })

  return seasons
}
