'use strict'
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 此处vue打包配置，只针对client客户端打包。此后还有相关的 SDK打包脚手架工具
module.exports = {
  publicPath: '/',
  outputDir: 'dist/client',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 9080,
    open: process.platform === 'darwin',
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: false,
  },
  configureWebpack: {
    name: '监控平台',
    entry: './client/main.js',
    resolve: {
      alias: {
        '@': resolve('client')
      }
    },
    plugins: [
      new CopyPlugin([
        {
          from: resolve('./'),
          to: resolve('./dist/'),
          toType: 'dir',
          ignore: [
            '.editorconfig',
            '.gitignore',
            'yarn.lock',
            'package.lock.json',
            '.DS_Store',
            '.idea/**/*',
            'tests/**/*',
            'node_modules/**/*',
          ],
        },
      ]),
    ],
  }
}
