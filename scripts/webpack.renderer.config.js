const { resolve } = require('path');
const { productName } = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const base = require('./webpack.base.config');
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
  let config = {
    experiments: base.experiments,
    node: {
      ...base.node
    },
    mode: env,
    target: 'web',
    entry: {
      app: './src/renderer/index.ts'
    },
    output: {
      filename: './web/[name].renderer.js',
      chunkFilename: './web/[id].renderer.js',
      path: resolve('dist')
    },
    resolve: {
      ...base.resolve,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          exclude: /\.lazy\.(sa|sc|c)ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.lazy\.(sa|sc|c)ss$/i,
          use: [
            { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
            'css-loader',
            'sass-loader'
          ]
        },
        ...base.module.rules,
      ]
    },
    plugins: [
      new DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
      }),
      new HtmlWebpackPlugin({
        title: productName,
        template: './resources/build/index.html'
      }),
      new VueLoaderPlugin()
    ],
    optimization: {
      minimize: env === 'production'
    }
  };
  if (env === 'production') config.devtool = base.devtool;
  return config;
};
