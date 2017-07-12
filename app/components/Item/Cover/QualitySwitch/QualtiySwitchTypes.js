import type { TorrentType } from 'api/metadata/MetadataTypes'

export type Props = {
  torrents: {
    '1080p': TorrentType,
    '720p': TorrentType,
  },
  setTorrent: () => void
}
