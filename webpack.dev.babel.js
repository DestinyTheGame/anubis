import webpack from 'webpack';
import path from 'path';

const config = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr',
    './app',
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png|\.svg$/,
        loader: 'file-loader'
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: 'http://localhost:9000/dist/',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  target: 'electron-renderer',
};

module.exports = config;
