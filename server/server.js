var express = require('express');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/assets/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/www/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});