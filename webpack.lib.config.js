const webpack = require('webpack');
const baseConfig = require('./webpack.build.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

delete baseConfig.output.umdNamedDefine;

baseConfig.entry = './src/js/index-lib.js';
baseConfig.output.libraryTarget = 'var';
baseConfig.output.library = 'Manny';
baseConfig.output.filename = 'manny.lib.js';
baseConfig.plugins = [
  new CleanWebpackPlugin(['lib'], {
    root: __dirname,
    exclude: ['manny.js'],
    verbose: true
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  })
];

module.exports = baseConfig;
