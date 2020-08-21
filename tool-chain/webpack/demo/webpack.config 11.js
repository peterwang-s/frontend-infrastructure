var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var currentTarget = process.env.npm_lifecycle_event;
var webpackDevServer = require("webpack-dev-server");
var cleanWebpackPlugin = require('clean-webpack-plugin');
var pkg =require('./package.json');
var debug,devServer,minimize,apiEnv,useVconosle,build;
var autoprefixer = require('autoprefixer');
var argv = require('yargs').argv;
apiEnv = argv.env;
debug = true;
build = false;

if(currentTarget == "build-pro" || currentTarget == "build-pro-min"){
  useVconosle = true;
}

if(currentTarget == "build-testing-noconsole"){
  useVconosle = true;
  build = true;
}

if (currentTarget == "build-testing" || currentTarget == "build-pro" || currentTarget == "build-pro-min" || currentTarget == "build-testing-min" || currentTarget == "build-dev-min") {
    devServer = false, minimize = true,build = true;
} else if (currentTarget == "dev" || currentTarget == "qa") {
    devServer = false, minimize = false;
} else if (currentTarget == "dev-hrm") {
    devServer = true, minimize = false;
}

if(currentTarget == "build-pro-min" || currentTarget == "build-testing-min" || currentTarget == "build-dev-min"){
    debug = false;
}

var config = {
  entry: {
    app: './js/main'
  },
  output: {
    publicPath: '', 
    libraryTarget: 'umd',
    path: __dirname+'/dist', 
    filename: devServer ? 'js/[name].js' : 'js/[name]-[hash:8].js'
  },
  module: {
    loaders: [{
       test: /\.js$/,
       loader: 'babel-loader',
       query: {
         presets: ['es2015']
       }
      },
      {
           test: /\.css$/,
           use: ExtractTextPlugin.extract({
               fallback: "style-loader",
               use: [{
                   loader: "css-loader",
                   options: {
                       modules: false,
                       minimize: true
                   }
               }, {
                   loader: "postcss-loader"
               }],
           })
      }, {
        test: /\.(eot|woff|svg|ttf|woff2|gif|otf)(\?|$)/,
        loader: 'file-loader?name=font/[hash].[ext]'
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=1200&name=img/[hash].[ext]'
      },
      {
        test: /\.html$/,loader: 'html-loader',
          options: {
            minimize: minimize,
            removeComments: true,
            collapseWhitespace: true
          }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: debug,
    inline: true,
    disableHostCheck:true,
    stats: 'errors-only',
    host: "0.0.0.0", // Defaults to `localhost`   process.env.HOST
    port: "80",  // Defaults to 8080   process.env.PORT
  },
  plugins: [
      new webpack.BannerPlugin('discovery3.0'),
      new webpack.optimize.OccurrenceOrderPlugin,
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: 'index.ejs',
        inject: true,
        useVconosle:useVconosle,
        ENV: JSON.stringify(apiEnv),
        minify: debug ? false : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyJS:true,
          minifyCSS: true,
          removeComments: true,
          removeEmptyAttributes: true,
        },
      }),
      new ExtractTextPlugin({filename:"[name]-[hash:8].css", allChunks: true}),
      new webpack.DefinePlugin({
          PRODUCTION: JSON.stringify(apiEnv),
          VERSION: JSON.stringify(" v" + pkg.version)
      }),
      new cleanWebpackPlugin(
          ['dist'],
          {
              root: __dirname,
              verbose:true,
              dry:false
          }
      )
  ],
  resolve: {
    extensions: ['.js'] 
  }
};

if(!debug){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
   compress: {
    warnings: false,
    drop_debugger: true,
    drop_console: true
   },
   minimize: false
  }))
}else {
  config.plugins.push(new CopyWebpackPlugin([{
      from: __dirname + '/lib/vconsole.min.js',
      to: __dirname + '/dist/js'
  }]))
}

module.exports = config;