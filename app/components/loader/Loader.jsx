// @flow
import React from 'react'

type Props = {
  isLoading: ?boolean,
  isFinished: ?boolean
}

export const Loader = ({ isLoading, isFinished }: Props) => (
  <div className="Loader" style={{
    opacity: isLoading ? 1 : 0,
    display: isFinished ? 'none' : 'initial'
  }}>
    <div className="Loader--container">
      <div className="Loader--dot" />
      <div className="Loader--dot" />
      <div className="Loader--dot" />
    </div>
  </div>
)

Loader.defaultProps = {
  isLoading : false,
  isFinished: false
}

export default Loader
