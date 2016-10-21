var webpackMerge = require('webpack-merge');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var webpack = require('webpack');
/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

const localhost = 'localhost';
/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || localhost;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
    host: HOST,
    ENV: ENV,
    HMR: HMR
});

module.exports = function(options) {
    METADATA.port = options.devPort;
    var launchUrl = 'http://' + localhost + ':' + METADATA.port + '/';

    return webpackMerge(commonConfig({ env: ENV, buildOptions: options }), {

        devtool: 'cheap-module-source-map',

        output: {
            path: helpers.root('dist'),
            publicPath: '/', //this is the path which appears in url /index.html => devbuild/index.html
            filename: '[name].bundle.js', //for creating chunks - we could also use [chunkhash]
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[name].map',
            library: 'ac_[name]',
            libraryTarget: 'var',
        },

        plugins: [
            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                }
            }),

            /**
             * Plugin: NamedModulesPlugin (experimental)
             * Description: Uses file names as module name.
             *
             * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
             */
            new NamedModulesPlugin(),

            new OpenBrowserPlugin({ url: launchUrl })
        ],



        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            stats: 'minimal',
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            outputPath: helpers.root('dist')
        },

        /*
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
}