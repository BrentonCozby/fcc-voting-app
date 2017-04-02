import {
    HotModuleReplacementPlugin,
    HashedModuleIdsPlugin,
    NamedModulesPlugin,
    optimize
} from 'webpack'
import { resolve } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ChunkManifestPlugin from "chunk-manifest-webpack-plugin"
import WebpackChunkHash from "webpack-chunk-hash"
import HtmlPlugin from 'html-webpack-plugin'
import ResourceHintsPlugin from 'resource-hints-webpack-plugin'
import FaviconsPlugin from 'favicons-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

/************************************************************
    ENTRY CONFIG
************************************************************/
const entry = (env) => {
    let entryConfig = [
        'react-hot-loader/patch',
        resolve(__dirname, 'src/client/index.jsx')
    ]

    if(env === 'dev') {
        entryConfig.push(
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server'
        )
    }

    return entryConfig
}

/*************************************************************
    PLUGINS CONFIG
*************************************************************/
const plugins = (env) => {
    let pluginsConfig = [
        new ExtractTextPlugin(
            (env === 'prod')
            ? 'style.[chunkhash].css'
            : 'style.css'
        ),
        new HtmlPlugin({
            template: 'src/client/index.html',
            inject: 'body'
        }),
        new ResourceHintsPlugin(),
        new optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
               return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest"
        }),
        new FaviconsPlugin(resolve(__dirname, 'assets', 'b-icon.png')),
        new CopyPlugin([
            {from: resolve(__dirname, 'src', 'client', '.htaccess')},
            {from: resolve(__dirname, 'src', 'client', '404.html')},
            {from: resolve(__dirname, 'src', 'client', 'crossdomain.xml')},
            {from: resolve(__dirname, 'src', 'client', 'humans.txt')},
            {from: resolve(__dirname, 'src', 'client', 'robots.txt')}
        ])
    ]

    if(env === 'dev') {
        pluginsConfig.push(
            new HotModuleReplacementPlugin(),
            new NamedModulesPlugin()
        )
    }

    return pluginsConfig
}

/************************************************************
    MAIN CONFIG
************************************************************/
const config = function(env) {
    return {
        entry: entry(env),
        output: {
            filename: (env === 'prod')
                ? '[name].[chunkhash].js'
                : '[name].js',
            chunkFilename: '[name].[chunkhash].js',
            path: resolve(__dirname, 'dist', 'client'),
            publicPath: '/'
        },
        module: {
            rules: [
                {test: /\.js?x$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {modules: false}],
                            'react'
                        ],
                        plugins: [
                            'syntax-dynamic-import',
                            'react-hot-loader/babel'
                        ]
                    }
                }]},
                {test: /\.scss$/,
                use: (env === 'prod')
                    ? ExtractTextPlugin.extract({
                        use: [
                            'css-loader',
                            {loader: 'postcss-loader',
                            options: {plugins: () => [require('autoprefixer')]}},
                            'sass-loader'
                        ]
                    })
                    : ['style-loader', 'css-loader', 'sass-loader']
                },
                {test: /\.(jpe?g|png|gif|svg|ico)$/,
                use: [
                    {loader: 'url-loader',
                    options: {limit: 40000, name: '[name].[ext]'}},
                    {loader: 'image-webpack-loader', options: {}}
                ]}
            ]
        },
        resolve: {
            modules: [
                resolve(__dirname, 'src', 'client'),
                'node_modules'
            ]
        },
        plugins: plugins(env),
        devtool: (env === 'dev') ? 'inline-source-map' : false,
        devServer: {
            hot: true,
            contentBase: resolve(__dirname, 'dist'),
            publicPath: '/'
        }
    }
}

module.exports = config
