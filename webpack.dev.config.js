const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/js/index-dev.js',

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[chunkhash].js',
    chunkFilename: '[id].bundle.js'
  },

  devtool: 'cheap-source-map',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.join(__dirname, 'js', 'src')],
        exclude: [path.join(__dirname, 'node_modules')],
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      exclude: ['favicon.ico'],
      verbose: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/templates/index.html'),
      hash: true,
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    inline: true, // live reloading
    stats: {
      colors: true,
      reasons: true,
      modules: false
    }
  },

  performance: {
    hints: false
  }
};
