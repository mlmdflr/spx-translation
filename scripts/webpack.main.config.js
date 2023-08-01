const { resolve } = require('path');
const { dependencies } = require('../package.json');
const base = require('./webpack.base.config');

module.exports = (env) => {
  let config = {
    ...base,
    mode: env,
    externals: {},
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts',
      preload: './src/main/preload/index.ts',
      'preload.url': './src/main/preload/index.url.ts'
    },
    output: {
      filename: './electron/[name].js',
      path: resolve('dist')
    },
    optimization: {
      minimize: env === 'production'
    }
  };
  if (env === 'production') config.devtool = base.devtool;
  for (const i in dependencies) config.externals[i] = `require("${i}")`;
  return config;
};
