// 本地开发webpack配置
const webpack = require('webpack');
// const path = require('path');
const { merge } = require('webpack-merge');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const urlConfig = require('../config/url.js');

const config = urlConfig.development;

let webpackDevConfig = merge(webpackBaseConfig, {
  // 本地开发环境配置, 设置请参考webpack-dev-server@4.0
  devServer: {
    // contentBase: '../public', //  removed in favor of the static option
    // stats: 'errors-only', // removed, please use the stats option from webpack.config.js
    hot: true,
    compress: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // noInfo: true, // removed in favor of built-in webpack logger
    // overlay: true, // the overlay option was moved into the client option
    // progress: true, // moved to the client option
    client: {
      progress: true,
      port: config.port,
      // overlay: true // default true
    },

    // disableHostCheck: true, //  removed in favor of the firewall option
    firewall: false, // Previously disableHostCheck and allowedHosts

    // openPage: `${config.localUrl}:${config.port}`, // removed in favor open.target
    port: config.port,
    open: config.autoOpenBrowser && {
      target: `${config.localUrl}:${config.port}`,
    },
    // host: '0.0.0.0', // 服务器外部可访问
    proxy: {
      [config.apiUrlFilter]: {
        target: config.targetUrl,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new ReactRefreshWebpackPlugin(), // 接口报错时，前端跳到插件错误页面
  ],
  devtool: 'inline-source-map',
  // devtool: 'eval-cheap-module-source-map',
});

module.exports = webpackDevConfig;
