import Network from './network.js';
import Game from './game.js';

let game = new Game();
let connection = new Network(game);
connection.setup();

if (module.hot) {
  module.hot.accept();
}