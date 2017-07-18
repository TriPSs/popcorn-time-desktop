import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpackMerge from 'webpack-merge'

import config from '../config'
import baseConfig  from './webpack.config.renderer.base'

export default webpackMerge(baseConfig, {

  devtool: 'source-map',

  target: 'electron-renderer',

  entry: config.utils_paths.src('index.js'),

  output: {
    path      : config.utils_paths.dist(),
    publicPath: './dist/',
  },

  plugins: [
    new ExtractTextPlugin('style.css'),

    new BundleAnalyzerPlugin({
      analyzerMode: config.open_analyzer ? 'server' : 'disabled',
      openAnalyzer: config.open_analyzer,
    }),
  ],
})
