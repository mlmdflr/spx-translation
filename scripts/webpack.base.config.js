const { resolve } = require('path');
const WebpackObfuscator = require('webpack-obfuscator');
module.exports = {
  devtool: 'eval-cheap-source-map',
  experiments: {
    topLevelAwait: true
  },
  node: {
    global: false,
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      dist: resolve('dist'),
      '@': resolve('src'),
    },
    fallback: {
      'url': false
    }
  },
  module: {
    rules: [
      {
        test: /\.(mjs|map)$/,
        resolve: {
          fullySpecified: false
        },
        include: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.(tsx|jsx|ts|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                dynamicImport: true
              },
              target: 'es2022'
            }
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      },
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        enforce: 'post',
        use: {
          loader: WebpackObfuscator.loader,
          options: {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.50,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: true,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            stringArray: true,
            stringArrayEncoding: 'base64',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
          }
        }
      },
    ]
  }
};
