/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import Torrent from 'api/Torrent'
import type { Props } from './BufferingTypes'
import classes from './Buffering.scss'

export class Buffering extends React.Component {

  props: Props

  constructor(props) {
    super(props)
    // Torrent.addEventListener(Torrent.EVENT_BUFFERING, this.onBuffering)
  }

  onBuffering = (data) => {
    console.log(data.downloaded, data.toDownload, data.downloaded / data.toDownload)
    console.log('onBuffering', data)
  }

  render() {
    const { item } = this.props

    return (
      <div className={classNames('col-sm-12', classes.buffering)}>
        <h1 className={'row-margin'}>
          {item.title}
        </h1>


      </div>
    )
  }
}

export default Buffering
