import Event from 'events';
import * as Constants from '../common/constants.js';

export default class Game {
	constructor(){
		this.players = new Map();
		this.tickrate = 30;
		this.eventEmitter = new Event.EventEmitter();
	}
	
	start(){
		this.tick();
	}
	
	// this is the main tick of the server
	// this is where we run it at 30 hz
	tick(){
		let startTime = new Date().getTime();
		// do all the calculation of stuff
		
		for (let [id, player] of this.players){	
			player.x += player.vx;
			player.y += player.vy;
		}

		// log time it took
		let endTime = new Date().getTime();
		//console.log("tick took: " + (endTime - startTime) +"ms");
		
		// once done emit event that we are done
		this.eventEmitter.emit(Constants.SERVER_TICK_COMPLETE);
		setTimeout(this.tick.bind(this), (1000 / this.tickrate));
	}
	
	// lets me add a player to the game
	addPlayer(id){
		let player = {
			'id': id,
			'color': this.getRandomColor(),
			'x': 100,
			'y': 100,
			'vx': 0,
			'vy': 0,
			'r': 0
		}
		this.players.set(id, player);
		this.eventEmitter.emit(Constants.ADDED_PLAYER, player);
		return player;
	}
	
	updatePlayer(player){
		let oldPlayer = this.players.get(player.id);
		let newPlayer = Object.assign(oldPlayer, player);
		this.players.set(newPlayer.id, newPlayer);
	}

	// lets me remove a player from the game
	removePlayer(player){
		this.players.delete(player.id);
		this.eventEmitter.emit(Constants.REMOVED_PLAYER, player);
	}
	
	// get data for user
	getDataForPlayer(player){
		// for now we will just return all player data
		let visiblePlayers = [];

		this.players.forEach((value, key) => {
			visiblePlayers.push(value);	
		});
		return {
			'players': visiblePlayers
		};
	}

	getRandomColor() {
		let length = 6;
		const chars = '0123456789ABCDEF';
		let hex = '0x';
		while(length--) hex += chars[(Math.random() * 16) | 0];
		return hex;
	}
}