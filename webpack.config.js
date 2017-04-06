const webpack = require('webpack');
const path = require('path');
const entry = require('./entry.config.js').entry;
const html = require('./entry.config.js').html;

const PATH_SRC = path.join(__dirname, 'src');
const PATH_DIST = path.join(__dirname, "dist");

module.exports = {
  context: PATH_SRC,
  entry: entry,
  output: {
    path: PATH_DIST,
    filename: '[name].[hash:8].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'underscore-template-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash:8].[ext]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.less', '.css'],
    modules: [
      PATH_SRC,
      'node_modules',
    ],
    mainFiles: ['index', 'main'],
    alias: {  //指定路径的别名
      Utils: path.resolve(__dirname, 'src/utils'),
      Public: path.resolve(__dirname, 'public'),
      Assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  plugins: [
    ...html,
    new webpack.optimize.CommonsChunkPlugin({
      names: 'common',
      minChunks: html.length,
      filename: 'assets/js/common.[hash:8].js'
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      '_': 'underscore',
      'window._': 'underscore',
    }),
  ]
};
