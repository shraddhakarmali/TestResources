//helpers used for util function such as resolve path.
var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //creates files out of css
var HtmlWebpackPlugin = require('html-webpack-plugin'); //to put all links in html file
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');

var minify = require('html-minifier').minify;
minify.collapseWhitespace = true;
/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    title: 'App Template',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer()
};

module.exports = function(options) {
    isProd = options.env === 'production';
    var buildPlugins = [

        new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules                                                                                                                      
            options: {
                metadata: METADATA
            }
        }),
        /*
         * Plugin: ForkCheckerPlugin
         * Description: Do type checking in a separate process, so webpack don't need to wait.
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
         */
        new ForkCheckerPlugin(),

        /*
         * Plugin: CommonsChunkPlugin
         * Description: Shares common code between the pages.
         * It identifies common modules and put them into a commons chunk.
         *
         * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
         * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor'].reverse()
        }),

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
            template: 'templates/index.template',
            chunksSortMode: 'dependency',
            baseHref: METADATA.baseUrl,
            title: METADATA.title,
            ENV: options.env,
            minify: options.env === 'production' ? minify : false,
            useElementLibrary: options.buildOptions && options.buildOptions.useElementLibrary,
        })
    ];

    if (options.buildOptions && options.buildOptions.useElementLibrary) {
        buildPlugins.push(
            new CopyWebpackPlugin([
                { context: '../elem-library', from: '**/*', to: 'elem_lib/' }
            ])
        );
    }

    return {

        //FROM WHERE-> CONTEXT 
        //root directory from which the entry files are sourced or resolved
        context: helpers.root('src'),

        //ROOT OF THE TREE
        //this specifies the roots from which the webpack will start enumerating bundles
        //the key will be the "output chunk"
        //the value is the starting point from which the dependency trees are built
        entry: {
            'polyfills': 'templates/polyfills.ts',
            'vendor': 'templates/vendor.ts',
            'app': 'templates/main.ts'
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
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'string-replace-loader',
                query: {
                    search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
                    replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
                    flags: 'g'
                },
                include: [helpers.root('src')]
            }, {
                test: /\.ts$/,
                loaders: ['@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd,
                    'awesome-typescript-loader',
                    'angular2-template-loader'
                ],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
            }, {
                //json-loader - this simply takes json file and creates module.exports out of it
                loader: 'json',
                test: /\.json$/
            }, {
                //html loader will take each html file and translate <img src='file'> / require(html!./file.html) to fix the img src links
                test: /\.html$/,
                loader: 'html',
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
            }, {
                enforce: 'post',
                test: /\.js$/,
                loader: 'string-replace-loader',
                query: {
                    search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
                    replace: 'var sourceMappingUrl = "";',
                    flags: 'g'
                }
            }]
        },

        plugins: buildPlugins,

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

    };
}