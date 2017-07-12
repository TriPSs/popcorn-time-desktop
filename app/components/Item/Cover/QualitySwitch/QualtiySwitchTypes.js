import type { TorrentType } from 'api/Torrents/TorrentsTypes'

export type Props = {
  showPlayInfo: boolean,
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
  },
  setTorrent: () => void
}
