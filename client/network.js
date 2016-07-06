import Event from 'events';

import * as Constants from '../common/constants.js';

export default class Network{
	constructor(game){
		this.game = game;
		this.socket = null;
		this.currentPing = 0;
		this.lastPingTime = null;
		this.gameRunning = false;
		this.tickrate = 30;
	}
	
	setup(){
		var self = this;
		this.socket = io();
		this.socket.connect();
		
		// this is where we start the game
		this.socket.on(Constants.NEW_PLAYER, (playerData) => {
			self.game.start(playerData);
			self.gameRunning = true;
			this.sendPlayerUpdates();
		});

		// figure out latency
		this.socket.on(Constants.PONG, () => {
			let currentTime = Date.now();
			self.currentPing = currentTime - self.lastPingTime;
			self.game.setPing(self.currentPing);	
			setTimeout(self.ping.bind(self), 1000);
		});
		this.ping();

		// game updates
		this.socket.on(Constants.GAME_UPDATE, (data) => {
			if (!self.gameRunning)
				return;
			let players = data.players;
			self.game.setPlayers(players);
		});

	}
	
	ping(){
		this.lastPingTime = Date.now();
		this.socket.emit(Constants.PING);
	}

	sendPlayerUpdates(){ 
		let updates = this.game.getPlayerUpdates();
		if (updates.player){
			this.socket.emit(Constants.PLAYER_UPDATE, updates);
		}
		setTimeout(this.sendPlayerUpdates.bind(this), (1000 / this.tickrate));
	}
}
