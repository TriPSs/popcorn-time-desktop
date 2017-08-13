import ChromeCastProvider from './ChromeCastProvider'

export StreamingInterface from './StreamingInterface'

export const streamingProviders = () => ([
  new ChromeCastProvider(),
])

export default streamingProviders
