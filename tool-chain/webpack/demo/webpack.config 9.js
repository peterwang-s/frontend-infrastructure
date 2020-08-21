var webpack = require('webpack')
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var currentTarget = process.env.npm_lifecycle_event
var webpackDevServer = require('webpack-dev-server')
var cleanWebpackPlugin = require('clean-webpack-plugin')
var pkg = require('./package.json')
var debug, devServer, minimize, apiEnv, useVconosle, build
var autoprefixer = require('autoprefixer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var fs = require('fs')
var argv = require('yargs').argv
apiEnv = argv.env
debug = true
devServer = true;

(function (argument) {
  switch (currentTarget) {
    case 'build-testing':
    case 'build-pro':
    case 'build-pro-min':
    case 'build-testing-min':
      devServer = false, minimize = true
      break
    default:
      break
  }

  switch (currentTarget) {
    case 'build-pro-min':
    case 'build-testing-min':
      useVconosle = false
      debug = false
      break
    case 'build-pro':
    case 'build-testing':
    case 'testing':
      useVconosle = true
      break
    default:
      break
  }
}())

var config = {
  entry: {
    index: './src/main'
  },
  devtool: 'inline-source-map',
  output: {
    publicPath: '',
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: devServer ? 'src/[name].js' : 'src/[name]-[hash:8].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        // 'thread-loader',
        'babel-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        // 'thread-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader'
      ]
    }, {
      test: /\.(eot|woff|svg|ttf|woff2|gif|otf)(\?|$)/,
      use: [
        // 'thread-loader',
        'file-loader?name=font/[hash].[ext]'
      ]
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: minimize,
        removeComments: true,
        collapseWhitespace: true
      }
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        //   'thread-loader',
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ]
    }
    ]
  },
  devServer: {
    compress: false,
    port: 8080,
    host: '0.0.0.0'
    // allowedHosts: [
    //     'aos-testing.com'
    // ]
  },
  optimization: {
    minimizer: [

    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.BannerPlugin(pkg.name),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: '睡眠健康调研问卷',
      filename: 'index.html',
      template: 'index.ejs',
      inject: true,
      useVconosle: useVconosle,
      sentry: apiEnv,
      minify: debug ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(apiEnv),
      PRODUCTION: JSON.stringify(apiEnv),
      VERSION: JSON.stringify(' v' + pkg.version)
    }),
    new cleanWebpackPlugin(
      ['dist'], {
        root: __dirname,
        verbose: true,
        dry: false
      }
    ),
    new CopyWebpackPlugin([{
      from: 'src/img/',
      to: 'image/'
    }])
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
}

if (!debug) {
  config.optimization.minimizer.push(new UglifyJsPlugin({
    cache: true,
    parallel: true,
    uglifyOptions: {
      compress: false,
      mangle: true,
      extractComments: true,
      warnings: false
    }
  }))
  config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}))
} else {
  config.plugins.push(new CopyWebpackPlugin([{
    from: __dirname + '/lib/vconsole.min.js',
    to: __dirname + '/dist/js'
  }]))
}

module.exports = config
