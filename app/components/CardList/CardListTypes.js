/**
 * A list of thumbnail poster images of items that are rendered on the home page
 * @flow
 */
import React from 'react'

import type { ContentType } from 'api/metadata/MetadataTypes'

export type Props = {
  title?: string,
  limit?: number,
  items: Array<ContentType>,
  isLoading?: boolean,
  isFinished?: boolean
}
