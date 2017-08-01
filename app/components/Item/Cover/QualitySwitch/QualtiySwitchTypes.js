import type { TorrentType } from 'api/Torrents/TorrentsTypes'

export type Props = {
  showPlayInfo: boolean,
  mode: string,
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
    '480p': TorrentType,
  },
  torrent: TorrentType,
  setTorrent: () => void
}
