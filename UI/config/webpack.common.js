//helpers used for util function such as resolve path.
var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //creates files out of css
var HtmlWebpackPlugin = require('html-webpack-plugin'); //to put all links in html file
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');


module.exports = {
    //FROM WHERE-> CONTEXT 
    //root directory from which the entry files are sourced or resolved
    context: helpers.root('src'),

    //ROOT OF THE TREE
    //this specifies the roots from which the webpack will start enumerating bundles
    //the key will be the "output chunk"
    //the value is the starting point from which the dependency trees are built
    entry: {
        'polyfills': './polyfills.ts',
        'vendor': './vendor.ts',
        'app': './main.ts'
    },

    //HOW TO RESOLVE files
    // import {} from "mycomponent" => loads mycomponent or mycomponent.js or mycomponent.ts
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
        descriptionFiles: ['package.json', 'bower.json'],
        modules: [helpers.root('src'), 'node_modules', 'bower_components']
    },

    //WHAT TO DO WITH EACH FILE 
    module: {
        rules: [{
            test: /\.ts$/,
            loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
            exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
        }, {
            //json-loader - this simply takes json file and creates module.exports out of it
            loader: 'json',
            test: /\.json$/
        }, {
            //html loader will take each html file and translate <img src='file'> / require(html!./file.html) to fix the img src links
            test: /\.html$/,
            loader: 'html'
        }, {
            //take images, fonts, icons etc and emit that file in the output directory with below names
            //if you want to retain the original path structure then you can use [path] in name template
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=10000'
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!less-loader' })
        }, {
            //include the css from the files 
            test: /\.css$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
        }]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: '../node_modules/core-js/client/shim.min.js' },
            { from: '../node_modules/zone.js/dist/zone.js' },
            { from: '../node_modules/reflect-metadata/Reflect.js' },
        ]),
        /**
         * Plugin: ContextReplacementPlugin
         * Description: Provides context to Angular's use of System.import
         * 
         * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
         * See: https://github.com/angular/angular/issues/11580
         */
        new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('src') // location of your src
        ),
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]

}