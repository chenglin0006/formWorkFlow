// 公用webpack配置
const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const config = require('../config/config');
const resolve = (dir) => path.resolve(process.cwd(), dir);
const PATH_NODE_MODULES = resolve('node_modules');
const devMode = process.env.CURRENT_ENV === 'development';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: ['./src/index.js'],
    verify: ['./src/verify.js'],
  },
  target: devMode ? 'web' : 'browserslist', // 当前版本开发环境设置web才能使hmr生效
  output: {
    path: resolve('public'),
    filename: devMode ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: devMode ? '[name].js' : `chunk.[name].[contenthash:8].js`,
    publicPath: '/',
    clean: true, // 是否清空之前的构建文件
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
      static: resolve('static'),
      config: resolve('config'),
    },
    fallback: {
      crypto: false, // 针对crypto-js处理
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader'],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: config.theme,
            },
          },
        ],
      },
      {
        // css-module
        test: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
              modules: {
                localIdentName: devMode ? '[name]_[local]_[hash:base64:5]' : '[local]_[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: config.theme,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:16].[ext]',
          publicPath: '/',
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        type: 'javascript/auto',
        generator: {
          filename: 'font/[name].[hash:6][ext]',
        },
      },
    ],
  },
  plugins: [
    // changed from eslint-loader
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      formatter: 'table',
      threads: true,
    }),
    new HtmlWebpackPlugin({
      title: config.projectName,
      filename: 'index.html',
      chunk: ['app'],
      excludeChunks: ['verify'],
      inject: true,
      template: 'src/index.template.html',
    }),
    // new HtmlWebpackPlugin({
    //   title: config.projectName,
    //   inject: true,
    //   filename: 'index.html',
    //   template: 'src/index.template.html',
    // }),
    new HtmlWebpackPlugin({
      filename: 'app/verify.html',
      title: '滑块验证',
      chunk: ['verify'],
      excludeChunks: ['app'],
      inject: true,
      template: 'src/index.verify.html',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: devMode ? '[name].css' : 'chunk.[name].[contenthash:8].css',
      ignoreOrder: true, // 忽略有关顺序冲突的警告
    }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
    // 由于webpack5删除了node polyfill相关，添加该Plugin后项目中可引用process.env.NODE_ENV
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    // 将antd的momentjs替换成dayjs
    new AntdDayjsWebpackPlugin(),
    // 添加该Plugin后项目中可引用process.env.CURRENT_ENV
    new webpack.EnvironmentPlugin(['CURRENT_ENV']),
  ],
  performance: {
    hints: false,
  },
  stats: {
    children: false,
  },
};
