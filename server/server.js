import Game from './game.js';
import GameMap from '../common/maps/map1.js';
import Network from './network.js';

const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// ######### this is all webpack stuff #############
const compiler = webpack(webpackConfig);

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
});

app.get('/states', (req, res) => {
  res.sendFile(__dirname + '/www/states.html');
});

app.get('/states/info', (req, res) => {
  res.send(game.states);
});
// #################################################
// ######### here starts the game stuff ############

let map = new GameMap();
let game = new Game(map);
const connections = new Network(io, game);
connections.setup();
game.start();

const server = http.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
