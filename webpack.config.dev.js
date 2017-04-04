const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./webpack.config.js');

const PATH_DIST = path.join(__dirname, 'dist');
const PATH_PUBLIC = path.join(__dirname, "public");
const PATH_MOCK = path.join(__dirname, "mock");

module.exports = function () {
    return webpackMerge(config, {
        devtool: 'cheap-module-source-map',
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    use: [
                        {
                            loader: 'style-loader'    //通过HTML热更新,使css达到热更新
                        },
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
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                    ]
                }
            ]
        },
        plugins: [
            // 开启全局的模块热替换（HMR）
            new webpack.HotModuleReplacementPlugin(),
            // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
            new webpack.NamedModulesPlugin(),
        ],
        devServer: {
            hot: true,
            port: 3000,
            compress: false,
            contentBase: [PATH_PUBLIC, PATH_MOCK],
            historyApiFallback: true,
            inline: true,
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                version: false,
                color: true,
                publicPath: true,
                timings: true,
                warnings: true,
                errors: true,
                errorDetails: true
            },
            // proxy: {
            //     '/test/*': {
            //         target: 'http://localhost',
            //         secure: false
            //     }
            // }
        }
    })
}