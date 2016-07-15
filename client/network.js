import Event from 'events';

import * as Constants from '../common/constants.js';
import * as Utils from '../common/utils.js';

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
		});

		// figure out latency
		this.socket.on(Constants.PONG, () => {
			let currentTime = Utils.now();
			self.currentPing = currentTime - self.lastPingTime;
			self.game.setPing(self.currentPing);	
			setTimeout(self.ping.bind(self), 1000);
		});
		this.ping();

		// game updates
		this.socket.on(Constants.GAME_UPDATE, (data) => {
			if (!self.gameRunning)
				return;
			self.game.updatePlayers(data.players);
			self.game.updateCurrentPlayer(data.currentPlayer);
			self.game.updateWalls(data.walls);
			self.game.updateBullets(data.bullets);
		});

		window.addEventListener('playerUpdate', (event) => {
			let updates = self.game.getPlayerUpdates();
			if (updates.player){
				this.socket.emit(Constants.PLAYER_UPDATE, updates);
			}
		});

		window.addEventListener('fired', (event) => {
			let updates = self.game.getBulletData();
			if (updates.bullet){
				this.socket.emit(Constants.PLAYER_UPDATE, updates);
			}
		});
	}
	
	ping(){
		this.lastPingTime = Utils.now();
		this.socket.emit(Constants.PING);
	}

}
