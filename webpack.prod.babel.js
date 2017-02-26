import config from './webpack.dev.babel';
import webpack from 'webpack';

//
// Override our development configuration with prod locations.
//
config.entry = './components/app/index.js';
config.output = {
  path: __dirname + '/dist',
  publicPath: './dist/',
  filename: 'bundle.js'
};
config.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false,
    },
    output: {
      comments: false,
    },
    sourceMap: false,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  })
];

module.exports = config;
