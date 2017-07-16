/**
 * Build config for electron renderer process
 */

import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpackMerge from 'webpack-merge'
import BabiliPlugin from 'babili-webpack-plugin'
import baseConfig from './webpack.config.renderer.base'

export default webpackMerge(baseConfig, {

  devtool: 'source-map',

  entry: './app/index.js',

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/'
  },

  plugins: [
    new BabiliPlugin(),

    new ExtractTextPlugin({
      filename: 'style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],

})
