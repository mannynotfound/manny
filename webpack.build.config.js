const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',

  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'manny.js',
    library: 'Manny',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },

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
    new CleanWebpackPlugin(['lib'], {
      root: __dirname,
      exclude: ['manny.lib.js'],
      verbose: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ],

  // 3D models are not performant btw
  performance: {
    maxEntrypointSize: 2000000, // 2mb
    maxAssetSize: 10000000, // 10mb
    hints: 'warning'
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
