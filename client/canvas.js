export default class Canvas {
	
	constructor(){
		this.currentPing = 0;
		this.mainCanvas = document.getElementById("main");
		this.mainCanvas.width = window.innerWidth;
		this.mainCanvas.height = window.innerHeight;
		this.context = this.mainCanvas.getContext('2d');

		this.players = [];
		this.walls = [];
		this.bullets = [];
 		this.currentPlayer = null;
	}
	
	tick(delta) {
		// start the timer for the next animation loop
		requestAnimationFrame(this.tick.bind(this));
	
		this.updateState(delta);
	
		this.render();
	}
	
	updateState(delta){
		// this is where we would do client side prediction
	}
	
	render(){
		this.context.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

		this.context.font = "30px Arial";
		this.context.fillText("CurrentPing:" + this.currentPing + "ms",10,50);

		this.drawPlayer(this.currentPlayer);

		for (let player of this.players){
			this.drawPlayer(player);
		}

		for (let wall of this.walls){
			this.drawWall(wall);
		}

		for (let bullet of this.bullets){
			this.drawBullet(bullet);
		}
	}

	setPing(ping){
		this.currentPing = ping;
	}

	setCurrentPlayer(player){
		this.currentPlayer = player;
		this.setupControls();
	}

	updatePlayers(newPlayers){
		if (!this.currentPlayer)
			return;
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
				this.players.splice(i ,1);
			}
		}
		// so here now players should have just brand new people
		for (let i = 0; i < newPlayers.length; i++){
			this.players.push(newPlayers[i]);
		}
	}

	updateWalls(newWalls){
		if (!this.currentPlayer)
			return;
		let found = false;
		for (let i = this.walls.length - 1; i >=0; i--){
			let oldWall = this.walls[i];
			for (let j = newWalls.length - 1; j >= 0; j--){
				let newWall = newWalls[j];
				// if we have a player thats already there update the data
				if (oldWall.id == newWall.id){
					found = true;

					// remove new player from array
					newWalls.splice(j, 1);
					break;
				}
			}
			// if we get here then that means that old player is not part of it anymore
			if (!found) {
				this.walls.splice(i ,1);
			}
		}
		// so here now players should have just brand new people
		for (let i = 0; i < newWalls.length; i++){
			this.walls.push(newWalls[i]);
		}
	}

	// so for this one we should do client prediction and pretty much just check if the bullet is where its supposed to be
	// but in this first pass well actually do all bullet work here
	updateBullets(newBullets){
		if (!this.currentPlayer)
			return;
		let found = false;
		for (let i = this.bullets.length - 1; i >=0; i--){
			let oldBullet = this.bullets[i];
			for (let j = newBullets.length - 1; j >= 0; j--){
				let newBullet = newBullets[j];
				// if we have a player thats already there update the data
				if (oldBullet.id == newBullet.id){
					found = true;

					oldBullet.x = newBullet.x;
					oldBullet.y = newBullet.y;
					
					// remove new player from array
					newBullets.splice(j, 1);
					break;
				}
			}
			// if we get here then that means that old player is not part of it anymore
			if (!found) {
				this.bullets.splice(i ,1);
			}
		}
		// so here now players should have just brand new people
		for (let i = 0; i < newBullets.length; i++){
			this.bullets.push(newBullets[i]);
		}
	}

	updateCurrentPlayer(newCurrentPlayer){
		// since we do client side prediction do not update the r on the currentPlayer
		delete newCurrentPlayer.r;
		this.currentPlayer = Object.assign(this.currentPlayer, newCurrentPlayer);
	}


	drawPlayer(player){
		if (!player)
			return;
		// draw the person
      	this.context.save();
  		this.context.translate(player.x, player.y);
		this.context.rotate((player.r - 180) * Math.PI / 180);

		this.context.beginPath();
      	this.context.arc(0, 0, player.size / this.currentPlayer.zoom, 0, 2 * Math.PI, false);
      	this.context.fillStyle = '#'+player.color;
      	this.context.fill();
      
      	// draw the gun
      	this.context.fillRect(0, 0 - (12.5 / this.currentPlayer.zoom), 90 / this.currentPlayer.zoom, 25 / this.currentPlayer.zoom);
      	
		this.context.restore();
		
	}

	drawWall(wall){
		if (!wall)
			return;
		this.context.fillStyle = wall.color;
        this.context.fillRect (wall.x, wall.y, wall.width / this.currentPlayer.zoom, wall.height / this.currentPlayer.zoom);
	} 

	drawBullet(bullet){
		if (!bullet)
			return;
		this.context.beginPath();
      	this.context.arc(bullet.x, bullet.y, bullet.size / this.currentPlayer.zoom, 0, 2 * Math.PI, false);
      	this.context.fillStyle = '#'+bullet.color;
      	this.context.fill();
	}

	setupControls(){
		var self = this;
		this.mainCanvas.addEventListener('mousewheel', (event) => {
			if (!self.currentPlayer)
				return;
			let currentZoom = self.currentPlayer.zoom;
			let delta = event.deltaY / 100 / 2;
			currentZoom += delta ;
			if (currentZoom < 1) currentZoom = 1;
			if (currentZoom > 10) currentZoom = 10;
			self.currentPlayer.zoom = currentZoom;
			self.sendEvent('playerUpdate');
		}, false);
		

		this.mainCanvas.addEventListener('mousemove', (event) => {
		 	const mouseX = event.x;
		 	const mouseY = event.y;
			
		 	const playerX = self.currentPlayer.x;
		 	const playerY = self.currentPlayer.y;
							
		 	const degrees = Math.atan2(playerY - mouseY, playerX - mouseX) * 180 / Math.PI;
			
		 	self.currentPlayer.r = degrees;
		 	// maybe add some kind of delay here so we dont send every single one
		 	self.sendEvent('playerUpdate');
		});

		this.mainCanvas.addEventListener('mousedown', (event) => {
			self.sendEvent('fired');
		});
		
		const left = this.keyboard(65);
		left.press = function() {
			if (self.currentPlayer){
				self.currentPlayer.vx = -1;
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
				self.currentPlayer.vy = -1;
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
				self.currentPlayer.vx = 1;
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
				self.currentPlayer.vy = 1;
			}
		};
		down.release = function() {
			if (self.currentPlayer){
				self.currentPlayer.vy = 0;
			}
		};
	}
	
	keyboard(keyCode) {
		var self = this;
		const key = {};
		key.code = keyCode;
		key.press = undefined;
		key.release = undefined;
		//The `downHandler`
		key.downHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.press) {
					key.press();
					self.sendEvent('playerUpdate');
				}
				
			}
			event.preventDefault();
		};

		//The `upHandler`
		key.upHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.release) {
					key.release();
					self.sendEvent('playerUpdate');
				}
			}
			event.preventDefault();
		};
		var aux = this.mainCanvas;
		//Attach event listeners
		document.addEventListener(
			"keydown", key.downHandler.bind(key), false
		);
		document.addEventListener(
			"keyup", key.upHandler.bind(key), false
		);
		return key;
	}

	sendEvent(e){
    	var event = new Event(e);  
    	window.dispatchEvent(event);
	}
}

