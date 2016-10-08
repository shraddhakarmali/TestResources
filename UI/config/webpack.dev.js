var webpackMerge = require('webpack-merge');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var launchUrl = 'http://localhost:8080/'

module.exports = webpackMerge(commonConfig, {
    devtool: 'inline-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/', //this is the path which appears in url /index.html => devbuild/index.html
        filename: '[name].[hash].js', //for creating chunks - we could also use [chunkhash]
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
        new OpenBrowserPlugin({ url: launchUrl })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});