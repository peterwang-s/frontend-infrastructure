const webpack = require('webpack');
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rucksack = require('rucksack-css');
const autoprefixer = require('autoprefixer');
// const history = require('connect-history-api-fallback')
// const convert = require('koa-connect')


const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {

    mode: dev ? 'development' : 'production',

    devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',


    entry: './components/index.js',

    output: {
        path: resolve(__dirname, 'dist'),

        filename: "metroplex-vcl.js",
        chunkFilename: "metroplex-vcl.js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.less', '.scss', '.css', '.json'],
        modules: ['node_modules', 'resources'],
    },
    // devServer: {
    //     inline: true,
    //     contentBase: './dist',
    //     port: 3000
    // },

    module: {

        rules: [
            {

                test: /\.(js|jsx)$/,

                exclude: /node_modules/,
                use: ['babel-loader']//, 'eslint-loader'
            },

            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    rucksack(),
                                    autoprefixer({
                                        browsers: [
                                            'last 2 versions',
                                            'Firefox ESR',
                                            '> 1%',
                                            'ie >= 9',
                                            'iOS >= 8',
                                            'Android >= 4',
                                        ],
                                    }),
                                ]
                                , sourceMap: true
                            }
                        },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            // {
            //     test: /\.less/,
            //     use: ['style-loader', 'css-loader', 'less-loader?javascriptEnabled=true']
            // },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true,
                                debug: true,
                                keepQuery: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    rucksack(),
                                    autoprefixer({
                                        browsers: [
                                            'last 2 versions',
                                            'Firefox ESR',
                                            '> 1%',
                                            'ie >= 9',
                                            'iOS >= 8',
                                            'Android >= 4',
                                        ],
                                    }),
                                ]
                                , sourceMap: true
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                javascriptEnabled: true
                            },
                        },
                    ],
                }),
            },

            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: ['file-loader',
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: false,
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            template: './cellar/index.html',
            chunksSortMode: 'none'
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ],
    // optimization: {
    //     runtimeChunk: true,
    //     // splitChunks: [true],
    // },
}
//
// if (dev) {
//     module.exports.serve = {
//         port: 8080,
//         add: app => {
//             app.use(convert(history()))
//         }
//     }
// }
