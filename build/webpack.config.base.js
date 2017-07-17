import webpack from 'webpack'
import { dependencies as externals } from '../app/package.json'

import config from '../config'

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
    path         : config.utils_paths.src(),
    filename     : 'bundle.js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules   : [
      config.utils_paths.src(),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      ...config.globals,
      ...config.custom_globals,
    }),

    new webpack.NamedModulesPlugin(),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
      },
    }),
  ],

}
