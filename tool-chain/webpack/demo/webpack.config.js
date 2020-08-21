const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new extractTextPlugin("./src/style/guide-page.css");

module.exports = {
  mode: "production",
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: "style-loader", // 编译后用style-loader来渲染css
          use: [
              { loader: 'css-loader' },
          ]
      })
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    extractCSS
  ],
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    publicPath: '',
    libraryTarget: 'umd',
    library: "HmArouseAppSdk",
    libraryExport: 'default',
    path: path.join(__dirname) + '/dist',
    filename: 'app.js'
  },
};