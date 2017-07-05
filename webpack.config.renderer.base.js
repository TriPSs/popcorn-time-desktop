import path from 'path'
import webpackMerge from 'webpack-merge'
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
        test: /\.global\.scss$/,
        use : [
          {
            loader: 'style-loader',
          },
          cssLoaderConfig('[local]'),
          sassLoaderConfig,
        ],
      },
      {
        test: /^((?!\.global).)*\.scss$/,
        use : [
          {
            loader: 'style-loader',
          },
          cssLoaderConfig(),
          sassLoaderConfig,
        ],
      },

      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use : 'url-loader',
      },

      {
        test   : /\.(woff|woff2|otf|eot|ttf|svg)$/i,
        loaders: ['file-loader?hash=sha512&digest=hex&name=fonts/font-[name]-[hash:6].[ext]'],
      },

    ],
  },
})
