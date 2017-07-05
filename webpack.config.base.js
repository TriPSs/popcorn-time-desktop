import path from 'path'
import webpack from 'webpack'
import fs from 'fs'
import dotenv from 'dotenv'
import { dependencies as externals } from './app/package.json'

import config from './config'

// Get all the possible flags
const data   = fs.readFileSync('.env.example', { encoding: 'utf8' })
const buffer = new Buffer(data)
const flags  = Object.keys(dotenv.parse(buffer))

export default {
  externals: Object.keys(externals || {}),

  module: {
    rules: [
      {
        test   : /\.(js|jsx)$/,
        exclude: /node_modules/,
        use    : {
          loader : 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  output: {
    path         : path.join(__dirname, 'app'),
    filename     : 'bundle.js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules   : [
      path.join(__dirname, 'app'),
      'node_modules',
    ],
    // alias: {
    //   castv2: 'castv2-webpack'
    // }
  },

  plugins: [
    new webpack.DefinePlugin({
      ...config.globals,
      ...config.custom_globals,
    }),

    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG_PROD', ...flags]),
    new webpack.NamedModulesPlugin(),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
      },
    }),
  ],

}
