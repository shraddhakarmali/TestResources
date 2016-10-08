//helpers used for util function such as resolve path.
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');

var commonConfig = require('./webpack.common.js');

//remove the ts compiler rule and add a new one
commonConfig.module.rules.shift();
commonConfig.module.rules.push({
    test: /\.ts$/,
    loaders: ['awesome-typescript-loader?inlineSourceMap=true&sourceMap=false', 'angular2-template-loader'],
    exclude: [/\.(e2e)\.ts$/, /node_modules/]
});
//add istanbul for postloader to generate the coverage report
commonConfig.module.rules.push({
    test: /\.(js|ts)$/,
    loader: 'istanbul-instrumenter-loader',
    include: helpers.root('src'),
    exclude: [
        /\.(e2e|spec)\.ts$/,
        /node_modules/
    ]
});

module.exports = webpackMerge(commonConfig, {
    devtool: 'inline-source-map',

    entry: {},
});