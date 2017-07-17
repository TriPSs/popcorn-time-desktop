import path from 'path'
import webpackMerge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

import baseConfig from './webpack.config.base'

export const sassLoaderConfig = {
  loader : 'sass-loader',
  options: {
    sourceMap   : true,
    outputStyle : 'expanded',
    includePaths: [path.join(__dirname, 'app/styles')],
  },
}

export const cssLoaderConfig = (identName = '[name]__[local]___[hash:base64:3]') => ({
  loader : 'css-loader',
  options: {
    sourceMap     : true,
    minimize      : true,
    modules       : true,
    importLoaders : true,
    localIdentName: identName,
  },
})

export default webpackMerge(baseConfig, {

  target: 'electron-renderer',

  module: {
    rules: [
      {
        test: /^((?!\.global).)*\.scss$/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoaderConfig(),
            sassLoaderConfig,
          ],
        }),
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoaderConfig(),
          ],
        }),
      },
      {
        test: /\.global\.scss$/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoaderConfig('[local]'),
            sassLoaderConfig,
          ],
        }),
      },
      {
        test   : /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=img/img-[name]-[hash:6].[ext]',
          {
            loader: 'image-webpack-loader',
            query : {
              progressive  : true,
              pngquant     : {
                optimizationLevel: 7,
                quality          : '65-90',
                speed            : 4,
              },
              bypassOnDebug: true,
              optipng      : {
                optimizationLevel: 7,
              },
              gifsicle     : {
                interlaced: false,
              },
            },
          },
        ],
      },

      {
        test   : /\.(woff|woff2|otf|eot|ttf|svg)$/i,
        loaders: ['file-loader?hash=sha512&digest=hex&name=fonts/font-[name]-[hash:6].[ext]'],
      },

    ],
  },
})
