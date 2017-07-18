import webpackMerge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import BabiliPlugin from 'babili-webpack-plugin'
import baseConfig from './webpack.config.base'

import config from '../config'

if (config.env !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production')
}

export default webpackMerge(baseConfig, {

  devtool: 'source-map',

  target: 'electron-main',

  entry: config.utils_paths.src('main.dev'),

  output: {
    filename: 'main.prod.js',
    path    : config.utils_paths.src(),
  },

  plugins: [
    new BabiliPlugin(),

    new BundleAnalyzerPlugin({
      analyzerMode: config.open_analyzer ? 'server' : 'disabled',
      openAnalyzer: config.open_analyzer,
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname : false,
    __filename: false,
  },

})
