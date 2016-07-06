import Canvas from './canvas.js';
import * as Constants from '../common/constants.js';

export default class Game {
	
	constructor(){
		this.canvas = new Canvas();
		this.gameRunning = false;
	}

	start(player){
		this.currentPlayer = player;

		this.canvas.setCurrentPlayer(this.currentPlayer);
		
		// start the canvas
		this.canvas.tick(0);

		this.gameRunning = true;
	}

	setPing(ping){
		this.canvas.setPing(ping);
	}

	setPlayers(players){
		this.canvas.setPlayers(players);
	}

	getPlayerUpdates(){
		let playerData = {};
		playerData.id = this.canvas.currentPlayer.id;
		playerData.vx = this.canvas.currentPlayer.vx;
		playerData.vy = this.canvas.currentPlayer.vy;
		playerData.r = this.canvas.currentPlayer.r;
		return {
			'player': playerData
		}
	}
}