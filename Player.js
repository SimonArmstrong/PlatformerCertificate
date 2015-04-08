var Player = function() 
{
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.position = new Vector2(277, 245);
	this.scale = new Vector2(159, 180);
	this.width = this.scale.x;
	this.height = this.scale.y;
	
	this.jumping = false;
	
	this.velocity = new Vector2(0, 0);
	this.angularVelocity = 0;
	this.rotation = 0;
};

Player.prototype.update = function(deltaTime) 
{
	var acceleration = new Vector2(0, 0);
	var playerAccel = 5000;
	var playerDrag = 11;
	var jumpForce = 37500;
	var playerGravity = map.TILE * 9.8 * 4;
	
	acceleration.y = playerGravity;
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		acceleration.x -= playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		acceleration.x += playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping)
	{
		acceleration.y -= jumpForce;
		this.jumping = true;
	}
	if(!keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		this.jumping = false;
	}

	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	var nx = this.position.x % map.TILE;
	var ny = this.position.y % map.TILE;
	
	var cell = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty+1);
	
	if(this.velocity.y > 0)
	{
		if ((cell_down && !cell) || (cell_diag && !cell_right && nx))
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
		}
	}
	else if (this.velocity.y > 0)
	{
		if((cell && !cell_down) || (cell_right && !cell_diag && nx))
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
		}
	}
	else if (this.velocity.y < 0)
	{
		if((cell && !cell_down) || (cell_right && !cell_diag && nx))
		{
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;
			
			cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty+2);
			cell_diag = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty+2);
			
			ny = 0;
		}
	}
	
	if(this.velocity.x > 0)
	{
		if((cell_right && !cell) || (cell_diag && !cell_down && ny))
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
			//console.log("Hit: right");
			nx = 0;
		}
	}
	else if(this.velocity.x < 0)
	{
		if((cell && !cell_right) || (cell_down && !cell_diag && ny))
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
			
			nx = 0;
		}
	}
}

Player.prototype.draw = function () 
{
	context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}