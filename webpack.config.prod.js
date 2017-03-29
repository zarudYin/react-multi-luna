const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs-extra');
const path = require('path');
const config = require('./webpack.config.js');
const entries = require('./entry.config.js');
const PATH_DIST = path.join(__dirname, "dist");
const PATH_PUBLIC = path.join(__dirname, "public");

function copyPublicFolder() {
    fs.emptyDirSync(PATH_DIST);
    fs.copySync(PATH_PUBLIC, PATH_DIST, {
        dereference: true
    });
}

const htmlPluginArray = [];
for (let entry in entries) {
    htmlPluginArray.push(
        new HtmlWebpackPlugin({
            filename: `${entry}.html`,
            template: `${entry}.html`,
            chunks: ['common', entry],
        })
    )
}

module.exports = function (env) {

    //拷贝public到dist
    copyPublicFolder();

    return webpackMerge(config, {
        // devtool: 'source-map',
        devtool: 'hidden-source-map',
        output: {
            path: PATH_DIST,
            filename: '[name].[hash:8].js',
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
            ...htmlPluginArray,
            new webpack.optimize.CommonsChunkPlugin({
                names: 'common',
                minChunks: 3,
                filename: 'assets/js/common.[hash:8].js'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                output: {
                    comments: false,
                }
            }),
            new ExtractTextPlugin('[name].[contenthash:8].css')
        ],
    })
}