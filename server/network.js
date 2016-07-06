import * as Constants from '../common/constants.js';

export default class IO {
	constructor(io, game){
		this.io = io;
		this.sockets = new Map();
		this.game = game;
	}
	
	setup(){
		var self = this;
		// add handler for connection
		this.io.on(Constants.CONNECT, (socket) => {
			console.log('Client connected');
			let player = self.game.addPlayer(socket.id);
			socket.emit(Constants.NEW_PLAYER, player);

			self.sockets.set(socket.id, {'socket': socket, 'player': player});
			// add handler for disconnect
			socket.on(Constants.DISCONNECT, () => {
				console.log('Client disconnected')
				self.game.removePlayer(player);
				self.sockets.delete(socket.id);
			});
			
			// handle ping
			socket.on(Constants.PING, () => {
				socket.emit(Constants.PONG);
			});

			// handle player updates
			socket.on(Constants.PLAYER_UPDATE, (updates) => {
				self.game.updatePlayer(updates.player)
			});
		});
		
		this.game.eventEmitter.addListener(Constants.SERVER_TICK_COMPLETE, () => {
			// whenever a tick is complete send it to all users.
			// maybe a good idea to send only partial data to users
			for (let [id, map] of self.sockets){	
				let socket = map.socket;
				let player = map.player;
				 
				socket.emit(Constants.GAME_UPDATE, self.game.getDataForPlayer(player));
			}
		});
	}
}