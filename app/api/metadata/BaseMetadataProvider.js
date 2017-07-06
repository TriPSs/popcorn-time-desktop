// @flow
import { set, get } from '../../utils/Config'

import type { RuntimeType } from './MetadataTypes'
import type { contentType } from './MetadataProviderInterface'

export default class BaseMetadataProvider {

  /**
   * Temporarily store the 'favorites', 'recentlyWatched', 'watchList' items
   * in config file. The cache can't be used because this data needs to be
   * persisted.
   */
  updateConfig(type: string, method: string, metadata: contentType) {
    const property = `${type}`

    switch (method) {
      case 'set':
        set(property, [...(get(property) || []), metadata])
        return get(property)

      case 'get':
        return get(property)

      case 'remove': {
        const items = [
          ...(get(property) || []).filter(item => item.id !== metadata.id)
        ]

        return set(property, items)
      }
      default:
        return set(property, [...(get(property) || []), metadata])
    }
  }

  favorites(...args) {
    return this.updateConfig('favorites', ...args)
  }

  recentlyWatched(...args) {
    return this.updateConfig('recentlyWatched', ...args)
  }

  watchList(...args) {
    return this.updateConfig('watchList', ...args)
  }

  formatRuntimeMinutesToObject = (runtimeInMinutes: number): RuntimeType => {
    const hours   = runtimeInMinutes >= 60 ? Math.round(runtimeInMinutes / 60) : 0
    const minutes = runtimeInMinutes % 60

    return {
      full : hours > 0
        ? `${hours} ${hours > 1 ? 'hours' : 'hour'}${minutes > 0
          ? ` ${minutes} minutes`
          : ''}`
        : `${minutes} minutes`,
      short: hours > 0
        ? `${hours} ${hours > 1 ? 'hrs' : 'hr'}${minutes > 0
          ? ` ${minutes} min`
          : ''}`
        : `${minutes} min`,
      hours,
      minutes,
    }
  }
}
