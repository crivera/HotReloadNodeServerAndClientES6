export default class Canvas {
	
	constructor(){
		this.currentPing = 0;
		this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
		this.renderer.backgroundColor = 0x000000;

		// add the renderer view element to the DOM
		$('body').append(this.renderer.view);

		this.stage = new PIXI.Container();
		this.stage.interactive = true;
		this.stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
		
		this.pingText = new PIXI.Text('CurrentPing: 0ms', {fill: '#FFF'});
 
    	this.pingText.x = 20;
    	this.pingText.y = 15;
 		this.stage.addChild(this.pingText);
 
 		this.players = [];
 		this.currentPlayer = null;
	}
	
	tick(delta) {
		// start the timer for the next animation loop
		requestAnimationFrame(this.tick.bind(this));
	
		this.updateState(delta);
	
		// render the stage   
		this.renderer.render(this.stage);
	}
	
	updateState(delta){
		this.pingText.text = "CurrentPing:" + this.currentPing + "ms";

		for (let player of this.players){
			// now set each users position and rotation
			player.graphics.x = player.x;
			player.graphics.y = player.y;
			player.graphics.rotation = player.r;

		}
	}
	
	setPing(ping){
		this.currentPing = ping;
	}

	setCurrentPlayer(player){
		this.currentPlayer = player;
		this.currentPlayer.graphics = this.createPlayer(player);
		this.players.push(this.currentPlayer);
		this.setupControls();
	}

	setPlayers(newPlayers){
		let found = false;
		for (let i = this.players.length - 1; i >=0; i--){
			let oldPlayer = this.players[i];
			for (let j = newPlayers.length - 1; j >= 0; j--){
				let newPlayer = newPlayers[j];
				// if we have a player thats already there update the data
				if (oldPlayer.id == newPlayer.id){
					found = true;
					// update the coords
					oldPlayer.x = newPlayer.x;
					oldPlayer.y = newPlayer.y;
					oldPlayer.r = newPlayer.r;
			
					// remove new player from array
					newPlayers.splice(j, 1);
					break;
				}
			}
			// if we get here then that means that old player is not part of it anymore
			if (!found) {
				this.stage.removeChild(oldPlayer.graphics);
				this.players.splice(i ,1);
			}
		}
		// so here now players should have just brand new people
		for (let i = 0; i < newPlayers.length; i++){
			if (newPlayers[i].id == this.currentPlayer.id)
				continue;
			newPlayers[i].graphics = this.createPlayer(newPlayers[i]);
			this.players.push(newPlayers[i]);
		}
	}

	createPlayer(player){
		var graphics = new PIXI.Graphics();
				
		graphics.beginFill(player.color);
		graphics.drawCircle(100, 100, 50);
		graphics.drawRect(25,90,50,20);				
		graphics.vx = 0;
		graphics.vy = 0;
		graphics.endFill();
			
		graphics.pivot.x = 100;
		graphics.pivot.y = 100;
		
		this.stage.addChild(graphics);

		return graphics;		
	}

	setupControls(){
		var self = this;
		this.stage.on('mousemove', function(event){
			const mouseX = event.data.global.x;
			const mouseY = event.data.global.y;
			
			const playerX = self.currentPlayer.graphics.x;
			const playerY = self.currentPlayer.graphics.y;
							
			const angleRadians = Math.atan2(playerY - mouseY, playerX - mouseX);
			
			self.currentPlayer.r = angleRadians;
		});

		this.stage.on('mousedown', function(event){
			//allBulletsRef.push({
			//	"player": currentPlayer.key,
			//	"x": currentPlayer.graphics.x + (72 * Math.cos(currentPlayer.graphics.rotation) * -1),
			//	"y": currentPlayer.graphics.y + (72 * Math.sin(currentPlayer.graphics.rotation) * -1),
			//	"rotation": currentPlayer.graphics.rotation,
			//	"speed": 10,
			//	"createDate": new Date().getTime()
			//});
		});
		
		const left = this.keyboard(65);
		left.press = function() {
			if (self.currentPlayer){
				self.currentPlayer.vx = -5;
			}
		};
		left.release = function() {
			if (self.currentPlayer){
				self.currentPlayer.vx = 0;
			}
		};

		const up = this.keyboard(87);
		up.press = function() {
			if (self.currentPlayer){
				self.currentPlayer.vy = -5;
			}
		};
		up.release = function() {
			if (self.currentPlayer){
				self.currentPlayer.vy = 0;
			}
		};	

		const right = this.keyboard(68);
		right.press = function() {
			if (self.currentPlayer){
				self.currentPlayer.vx = 5;
			}
		};
		right.release = function() {
			if (self.currentPlayer){
				self.currentPlayer.vx = 0;
			}
		};

		const down = this.keyboard(83);
		down.press = function() {
			if (self.currentPlayer){
				self.currentPlayer.vy = 5;
			}
		};
		down.release = function() {
			if (self.currentPlayer){
				self.currentPlayer.vy = 0;
			}
		};
	}
	
	keyboard(keyCode) {
		const key = {};
		key.code = keyCode;
		key.isDown = false;
		key.isUp = true;
		key.press = undefined;
		key.release = undefined;
		//The `downHandler`
		key.downHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};

		//The `upHandler`
		key.upHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
			}
			event.preventDefault();
		};

		//Attach event listeners
		window.addEventListener(
			"keydown", key.downHandler.bind(key), false
		);
		window.addEventListener(
			"keyup", key.upHandler.bind(key), false
		);
		return key;
	}
}

