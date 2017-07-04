// @flow
import React from 'react'
import Item from '../components/item/Item.jsx'

type Props = {
  match: {
    params: {
      itemId: string,
      activeMode: string
    }
  }
}

export default (props: Props) => (
  <div>
    <Item
      itemId={props.match.params.itemId}
      activeMode={props.match.params.activeMode}
    />
  </div>
)
