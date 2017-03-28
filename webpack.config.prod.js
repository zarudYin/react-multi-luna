const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs-extra');
const path = require('path');
const config = require('./webpack.config.js');

const PATH_DIST = path.join(__dirname, "dist");
const PATH_PUBLIC = path.join(__dirname, "public");

function copyPublicFolder() {
    fs.emptyDirSync(PATH_DIST);
    fs.copySync(PATH_PUBLIC, PATH_DIST, {
        dereference: true
    });
}

module.exports = function (env) {

    //拷贝public到dist
    copyPublicFolder();

    return webpackMerge(config, {
        // devtool: 'source-map',
        devtool: 'hidden-source-map',
        output: {
            path: PATH_DIST,
            filename: '[name].[chunkhash:8].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(css|less)$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                }
                            },
                            {
                                loader: 'postcss-loader'
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true,
                                }
                            },
                        ]
                    })
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
                minChunks: Infinity,
                filename: '[name].[chunkhash:8].js'
            }),
            new ExtractTextPlugin('app.[contenthash:8].css')
        ],
    })
}