/**
 * Created by tycho on 07/07/2017.
 */
import React from 'react'
import classNames from 'classnames'

import classes from './Buffering.scss'

export const Buffering = ({ item }: Props) => (
  <div className={classNames('col-sm-6', classes.buffering)}>
    <h1 className={'row-margin'}>
      {item.title}
    </h1>


  </div>
)

export default Buffering
