import RarbgTorrentProvider from './RarbgTorrentProvider'

export const TorrentProviders = () => ([
  new RarbgTorrentProvider(),
  // new PbTorrentProvider(),
  // new YtsTorrentProvider(),
])

export default TorrentProviders
