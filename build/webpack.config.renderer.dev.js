import fs from 'fs'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { spawn, execSync } from 'child_process'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import debug from 'debug'

import baseConfig from './webpack.config.renderer.base'
import config from '../config'

const log = debug('app:build:webpack:renderer:dev')

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(config.utils_paths.dll()) && fs.existsSync(config.utils_paths.dll('vendor.json')))) {
  log('The DLL files are missing. Sit back while we build them for you with "npm run build:dll"')

  execSync('npm run build:dll')
}

export default webpackMerge(baseConfig, {

  devtool: 'inline-source-map',

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${config.dev_port}/`,
    'webpack/hot/only-dev-server',
    config.utils_paths.src('index'),
  ],

  output: {
    publicPath: `http://localhost:${config.dev_port}/dist/`,
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context   : config.utils_paths.base(),
      manifest  : require(config.utils_paths.dll('vendor.json')),
      sourceType: 'var',
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ExtractTextPlugin({
      disable: true,
    }),
  ],

  devServer: {
    port              : config.dev_port,
    publicPath        : `http://localhost:${config.dev_port}/dist/`,
    compress          : true,
    noInfo            : true,
    stats             : 'errors-only',
    inline            : true,
    lazy              : false,
    hot               : true,
    headers           : { 'Access-Control-Allow-Origin': '*' },
    contentBase       : config.utils_paths.dist(),
    watchOptions      : {
      aggregateTimeout: 300,
      poll            : 100,
      ignored         : 'app/dist,app/main.js,dll,flow-typed,node_modules,app/node_modules,release',
    },
    historyApiFallback: {
      verbose       : true,
      disableDotRule: false,
    },
    setup() {
      if (config.start_hot) {
        spawn('npm', ['run', 'start-main-dev'], {
          shell: true,
          env  : process.env,
          stdio: 'inherit',
        }).on('close', code => process.exit(code))
          .on('error', spawnError => log(spawnError))
      }
    },
  },
})
