import * as uuid from 'node-uuid';
import * as Utils from '../utils.js';

export default class GameMap {
	constructor(){
		this.width = 10000;
		this.height = 10000;

		this.walls = new Array();
		
		for (let i = 0; i < 1000; i++){
			let wallWidth = Utils.getRandomInt(5, 100);
			let wallHeight = Utils.getRandomInt(5, 100);
			let wallX = Utils.getRandomInt(0, this.width - 1);
			let wallY = Utils.getRandomInt(0, this.height - 1);
			let wall = {
				'id': uuid.v4(),
				'width': wallWidth,
				'height': wallHeight,
				'x': wallX,
				'y': wallY,
				'hp': 100,
				'color': '#FF00FF'
			};
			this.walls.push(wall);
		}
	}
}