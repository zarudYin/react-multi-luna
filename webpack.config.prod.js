const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs-extra');
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

module.exports = function () {
    //拷贝public到dist
    copyPublicFolder();

    return webpackMerge(config, {
        // devtool: 'source-map',
        // devtool: 'nosources-source-map',
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                }
                            },
                            {
                                loader: 'postcss-loader'
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ]
                    })
                }
            ]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                output: {
                    comments: false,
                }
            }),
            new ExtractTextPlugin('[name].[contenthash:8].css'),
        ],
    })
}