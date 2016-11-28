'use strict'

const path = require('path')
const fs   = require('fs')

const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

// use the `OPTIMIZE` env to switch from dev to production build
const optimize = process.env.OPTIMIZE === 'true'

module.exports = {
    entry: './src/initialize.js',
    output: {
        path: path.join('.', 'js'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    debug: !optimize,
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
        }]
    },
    plugins: [
        new ExtractTextPlugin(optimize? 'app.[hash].css' : 'app.css'),
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
