import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import chalk from 'chalk'
import webpackMerge from 'webpack-merge'
import { spawn, execSync } from 'child_process'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import baseConfig from './webpack.config.renderer.base'

const port       = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`
const dll        = path.resolve(process.cwd(), 'dll')
const manifest   = path.resolve(dll, 'vendor.json')

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(dll) && fs.existsSync(manifest))) {
  console.log(chalk.black.bgYellow.bold(
    'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
  ))

  execSync('npm run build-dll')
}

export default webpackMerge(baseConfig, {

  devtool: 'inline-source-map',

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'app/index'),
  ],

  output: {
    publicPath: `http://localhost:${port}/dist/`,
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context   : process.cwd(),
      manifest  : require(manifest),
      sourceType: 'var',
    }),

    /**
     * https://webpack.js.org/concepts/hot-module-replacement/
     */
    new webpack.HotModuleReplacementPlugin({
      // @TODO: Waiting on https://github.com/jantimon/html-webpack-plugin/issues/533
      // multiStep: true
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],

  devServer: {
    port,
    publicPath,
    compress          : true,
    noInfo            : true,
    stats             : 'errors-only',
    inline            : true,
    lazy              : false,
    hot               : true,
    headers           : { 'Access-Control-Allow-Origin': '*' },
    contentBase       : path.join(__dirname, 'dist'),
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
      if (process.env.START_HOT) {
        spawn('npm', ['run', 'start-main-dev'], {
          shell: true,
          env  : process.env,
          stdio: 'inherit',
        }).on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError))

      }
    },
  },
})
