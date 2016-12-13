'use strict'

const path = require('path')
const fs   = require('fs')

const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

// use the `OPTIMIZE` env to switch from dev to production build
const optimize = process.env.OPTIMIZE === 'true'
const imgPath = 'img/[name].[ext]';

module.exports = {
    entry: {
        app: './src/initialize.js',
        vendor: "./vendor/vendor.js"
    },
    output: {
        path: path.join('.', 'build'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['', '.js']
    },
    debug: !optimize,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                  presets: ['es2015']
                }
            },
            {
                test: /\.styl/,
                loader: ExtractTextPlugin.extract('css-loader!stylus-loader')
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract('css-loader')
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                loader: 'file?name=' + imgPath
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('app.css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            __SERVER__:      !optimize,
            __DEVELOPMENT__: !optimize,
            __DEVTOOLS__:    !optimize
        })
    ],
    stylus: {
        use: [require('cozy-ui/lib/stylus')()]
    }
};
