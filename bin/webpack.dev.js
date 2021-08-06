const webpack = require('webpack')
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 9090,
    open: true,
    compress: true, // 启用gzip压缩
    hot: true, // 热更新
    historyApiFallback: true, // 请求资源都访问index.html
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
