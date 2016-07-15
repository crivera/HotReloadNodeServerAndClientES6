import Event from 'events';
import State from './state.js';
import * as Constants from '../common/constants.js';
import * as Utils from '../common/utils.js';

export default class Game {
	
	constructor(map){
		this.map = map;
		this.inputs = new Array();
		this.states = new Array();
		
		this.tickrate = 30;
		this.eventEmitter = new Event.EventEmitter();
	}
	
	start(){
		let firstState = new State(this.map);
		this.states.push(firstState);
		this.tick();
	}
	
	// this is the main tick of the server
	// this is where we run it at 30 hz
	tick(){
		// create a new state and the the previous one
		let newState = new State(this.map);
		let previousState = this.states[this.states.length - 1];

		// now get all the inputs that were added since previous input
		let deltaInputs = this.inputs.filter((i) => {
			return i.serverDateReceived >= previousState.startDate;
		});

		newState.applyData(previousState, deltaInputs);
		this.states.push(newState);

		// remove all the old inputs
		this.inputs = this.inputs.filter((el) => {
  			return !deltaInputs.includes(el);
		});

		if (this.states.length > 100){
			this.states.splice(0, 1);
		}
		// once done emit event that we are done
		this.eventEmitter.emit(Constants.SERVER_TICK_COMPLETE);
		setTimeout(this.tick.bind(this), (1000 / this.tickrate));
	}
	
	addInputs(updates){
		updates.serverDateReceived = Utils.now();
		updates.type = Constants.INPUT;
		this.inputs.push(updates);
	}

	// lets me add a player to the game
	addPlayer(id){
		let player = {
			'id': id,
			'color': Utils.getRandomColor(),
			'x': 100,
			'y': 100,
			'vx': 0,
			'vy': 0,
			'speed': 5,
			'r': 0,
			'zoom': 1,
			'size': 50,
			'hp': 100
		}
		let updates = {};
		updates.serverDateReceived = Utils.now();
		updates.player = player;
		updates.type = Constants.PLAYER_ADD;
		this.inputs.push(updates);
		return player;
	}

	addBullet(updates){
		updates.serverDateReceived = Utils.now();
		updates.type = Constants.BULLET_ADD;
		this.inputs.push(updates);
	}

	// lets me remove a player from the game
	removePlayer(player){
		let updates = {};
		updates.serverDateReceived = Utils.now();
		updates.player = player;
		updates.type = Constants.PLAYER_REMOVE;
		this.inputs.push(updates);
	}
	
	// get data for user
	getDataForPlayer(player){
		// for now we will just return all player data
		// so here is where we do lag compensation by returning data to the people which happened 100 ms ago or whenever
		// as default for now we use the latest state
		return this.states[this.states.length - 1].getVisibleDataForPlayer(player);
	}

}