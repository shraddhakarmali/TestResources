var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');


const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
    ENV: ENV,
    HMR: false
});

module.exports = function(options) {
    return webpackMerge(commonConfig({ env: ENV, buildOptions: options }), {

        /**
         * Developer tool to enhance debugging
         *
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'source-map',

        /**
         * Options affecting the output of the compilation.
         *
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {

            publicPath: './',
            /**
             * The output directory as absolute path (required).
             *
             * See: http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root('../ResourceManager/'),

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].[chunkhash].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].[chunkhash].bundle.map',

            /**
             * The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].[chunkhash].chunk.js'

        },

        /**
         * Add additional plugins to the compiler.
         *
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [

            /**
             * Plugin: WebpackMd5Hash
             * Description: Plugin to replace a standard webpack chunkhash with md5.
             *
             * See: https://www.npmjs.com/package/webpack-md5-hash
             */
            new WebpackMd5Hash(),

            /**
             * Plugin: DedupePlugin
             * Description: Prevents the inclusion of duplicate code into your bundle
             * and instead applies a copy of the function at runtime.
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             * See: https://github.com/webpack/docs/wiki/optimization#deduplication
             */
            // new DedupePlugin(), // see: https://github.com/angular/angular-cli/issues/1587

            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
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
             * Plugin: UglifyJsPlugin
             * Description: Minimize all JavaScript output of chunks.
             * Loaders are switched into minimizing mode.
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
             */
            // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
            new UglifyJsPlugin({
                // beautify: true, //debug
                // mangle: false, //debug
                // dead_code: false, //debug
                // unused: false, //debug
                // deadCode: false, //debug
                // compress: {
                //   screw_ie8: true,
                //   keep_fnames: true,
                //   drop_debugger: false,
                //   dead_code: false,
                //   unused: false
                // }, // debug
                // comments: true, //debug


                beautify: false, //prod
                mangle: { screw_ie8: true, keep_fnames: true }, //prod
                compress: { screw_ie8: true }, //prod
                comments: false //prod
            }),

            /**
             * Plugin: NormalModuleReplacementPlugin
             * Description: Replace resources that matches resourceRegExp with newResource
             *
             * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
             */

            new NormalModuleReplacementPlugin(
                /angular2-hmr/,
                helpers.root('config/modules/angular2-hmr-prod.js')
            ),

            /**
             * Plugin: IgnorePlugin
             * Description: Don’t generate modules for requests matching the provided RegExp.
             *
             * See: http://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
             */

            // new IgnorePlugin(/angular2-hmr/),

            /**
             * Plugin: CompressionPlugin
             * Description: Prepares compressed versions of assets to serve
             * them with Content-Encoding
             *
             * See: https://github.com/webpack/compression-webpack-plugin
             */
            //  install compression-webpack-plugin
            // new CompressionPlugin({
            //   regExp: /\.css$|\.html$|\.js$|\.map$/,
            //   threshold: 2 * 1024
            // })

        ],
        /*
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: false,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
}