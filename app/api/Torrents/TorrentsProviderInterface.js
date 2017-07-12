// @flow
export interface TorrentProviderInterface {

  getStatus: () => Promise<boolean>,

  search: () => Promise<void>

}
