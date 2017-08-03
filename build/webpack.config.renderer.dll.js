import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

import baseConfig from './webpack.config.renderer.base'
import { dependencies } from '../package.json'
import config from '../config'

const { utils_paths, globals } = config
const { __PROD__ }             = globals

export const webpackDllConfig = webpackMerge(baseConfig, {

  context: utils_paths.base(),

  devtool: 'eval',

  externals: ['fsevents', 'crypto-browserify', 'webtorrent'],

  resolve: {
    modules: [
      utils_paths.src(),
      'node_modules',
    ],
  },

  entry: {
    vendor: Object.keys(dependencies || {}).filter(
      dependency => dependency !== 'font-awesome',
    ),
  },

  output: {
    library      : 'vendor',
    path         : utils_paths.dll(),
    filename     : '[name].dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new ExtractTextPlugin({
      disable: true,
    }),

    new webpack.DllPlugin({
      path: utils_paths.dll('[name].json'),
      name: '[name]',
    }),

    new webpack.LoaderOptionsPlugin({
      debug  : true,
      options: {
        context: utils_paths.src(),
        output : {
          path: utils_paths.dll(),
        },
      },
    }),
  ],

})

if (__PROD__) {
  webpackDllConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug   : false,
    }),
    new UglifyJSPlugin({
      beautify: false,
      mangle  : {
        screw_ie8  : true,
        keep_fnames: true,
      },
      compress: {
        warnings    : false,
        screw_ie8   : true,
        conditionals: true,
        unused      : true,
        comparisons : true,
        sequences   : true,
        dead_code   : true,
        evaluate    : true,
        if_return   : true,
        join_vars   : true,
      },
      comments: true,
    }),
  )
}

export default webpackDllConfig
