import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import webpackMerge from 'webpack-merge'
import baseConfig from './webpack.config.renderer.base'

export default webpackMerge(baseConfig, {

  devtool: 'source-map',

  target: 'electron-renderer',

  entry: './app/index.js',

  output: {
    path      : path.join(__dirname, 'app/dist'),
    publicPath: path.join(__dirname, 'app/dist/'),
  },

  plugins: [
    new ExtractTextPlugin('style.css'),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],
})
