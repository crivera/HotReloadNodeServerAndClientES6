import * as Utils from '../common/utils.js';
import * as Constants from '../common/constants.js';
import * as uuid from 'node-uuid';

export default class State {

	constructor(map){
		this.map = map;
		this.startDate = Utils.now();
		this.endDate = null;
		
		// for some stupid reason when i do new Map() there it doesnt work
		this.players = {};
		this.bullets = [];
		this.walls = map.walls;
	}

	applyData(previousState, updates){
		this.players = previousState.players;
		this.bullets = previousState.bullets;
		this.walls = previousState.walls;
		// so first update all the inputs that were given
		for (let i = 0; i < updates.length; i++){
			let update = updates[i];
			switch(update.type) {
			    case Constants.INPUT:
			        // handle player input
			        let player = this.players[update.player.id];
			        if (player){
			        	player.vx = update.player.vx;
			        	player.vy = update.player.vy;
			        	player.r = update.player.r;
			        	player.zoom = update.player.zoom;
			        }
			        break;
			    case Constants.PLAYER_ADD: {
			        // handle adding a player
			        this.players[update.player.id] = update.player;
			        break;
			    }
			    case Constants.PLAYER_REMOVE:
			    	// handle removing a player
			    	delete this.players[update.player.id];
			    	break;
			    case Constants.BULLET_ADD: {
			    	let player = this.players[update.bullet.playerId];
			    	let bullet = {
						'id': uuid.v4(),
						'playerId': player.id,
						'color': player.color,
						'x': player.x + (72 * Math.cos(player.r * Math.PI / 180) * -1),
						'y': player.y + (72 * Math.sin(player.r * Math.PI / 180) * -1),
						'vx': Math.cos(player.r * Math.PI / 180) * -1,
						'vy': Math.sin(player.r * Math.PI / 180) * -1,
						'speed': 10,
						'r': player.r,
						'size': 10,
						'createDate': Utils.now()
					};
			    	// handle adding a bullet
			    	this.bullets.push(bullet);
			    	break;
			    }
			    default:
			        // do nothing
			}
		}
		// then move all the players
		for (let id in this.players){
			let player = this.players[id];
			player.x += (player.vx * player.speed);
			player.y += (player.vy * player.speed);
		}

		let found = false;
		for (let i = this.bullets.length - 1; i >= 0; i--){
			let bullet = this.bullets[i];
			if (Utils.now() - bullet.createDate > 10 * 1000) {
				this.bullets.splice(i ,1);
			} else {
				bullet.x += (bullet.vx * bullet.speed);
				bullet.y += (bullet.vy * bullet.speed);
				this.bullets[i] = bullet;
			}
		}

		// then check collision

		this.endDate = Utils.now();
	}

	getVisibleDataForPlayer(player){
		let visiblePlayers = [];
		let playerId = player.id;
		let currentPlayer;
		for (let id in this.players){
			if (playerId == id){
				currentPlayer = this.players[id];
				continue;
			}
			let thePlayer = this.players[id];
			visiblePlayers.push(thePlayer);	
		};
		
		let visibleBullets = [];
		this.bullets.forEach((value) => {
			visibleBullets.push(value);	
		});

		let visibleWalls = [];
		this.walls.forEach((value) => {
			visibleWalls.push(value);	
		});
		return {
			'currentPlayer': currentPlayer,
			'players': visiblePlayers,
			'bullets': visibleBullets,
			'walls': visibleWalls
		};
	}
}