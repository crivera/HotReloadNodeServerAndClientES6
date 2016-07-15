import Canvas from './canvas.js';
import * as Constants from '../common/constants.js';
import * as Utils from '../common/utils.js';

export default class Game {
	
	constructor(){
		this.canvas = new Canvas();
		this.gameRunning = false;
	}

	start(player){
		this.canvas.setCurrentPlayer(player);
		
		// start the canvas
		this.canvas.tick(0);

		this.gameRunning = true;
	}

	setPing(ping){
		this.canvas.setPing(ping);
	}

	updatePlayers(players){
		this.canvas.updatePlayers(players);
	}

	updateWalls(walls){
		this.canvas.updateWalls(walls);
	}

	updateCurrentPlayer(currentPlayer){
		this.canvas.updateCurrentPlayer(currentPlayer);
	}

	updateBullets(bullets){
		this.canvas.updateBullets(bullets);
	}


	getPlayerUpdates(){
		if (!this.canvas.currentPlayer)
			return {};
		// this should only include data that the user can change like where i am going/looking/zooming
		let playerData = {};
		playerData.id = this.canvas.currentPlayer.id;
		playerData.vx = this.canvas.currentPlayer.vx;
		playerData.vy = this.canvas.currentPlayer.vy;
		playerData.r = this.canvas.currentPlayer.r;
		playerData.zoom = this.canvas.currentPlayer.zoom;
		return {
			'player': playerData
		}
	}

	getBulletData(){
		if (!this.canvas.currentPlayer)
			return {};
		// this should only include data that the user can change like where i am going/looking/zooming
		let bulletData = {};
		bulletData.playerId = this.canvas.currentPlayer.id;
		bulletData.x = this.canvas.currentPlayer.x;
		bulletData.y = this.canvas.currentPlayer.y;
		bulletData.r = this.canvas.currentPlayer.r;
		bulletData.clientDate = Utils.now();
		return {
			'bullet': bulletData
		}
	}
}