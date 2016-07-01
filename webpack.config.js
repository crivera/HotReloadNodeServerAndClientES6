var path = require('path');
var webpack = require('webpack');

var config = {
  context: path.join(__dirname, 'client'),
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './client.js',
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
  	loaders: [
    	{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  	]
  }
};
module.exports = config;