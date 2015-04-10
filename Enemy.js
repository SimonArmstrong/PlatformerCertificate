var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy.png";
	
	this.height = 159;
	this.width = 180;
	
	this.position = new Vector2(80, 400);
	this.velocity = new Vector2(0, 0);
	this.direction = RIGHT;
};

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2(0,0);
	var enemyAccel = 2000 * gameSpeed;
	var enemyDrag = 11;
	
	if(this.direction == RIGHT)
	{
		acceleration.x = enemyAccel;
	}
	else
	{
		acceleration.x = -enemyAccel;
	}
	var dragX = this.velocity.x * enemyDrag;
	acceleration.x -= dragX;
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var collisionOffset = new Vector2(56, this.height - map.TILE);
	var collisionPos = this.position.add(collisionOffset);
	
	var tx = pixelToTile(collisionPos.x);
	var ty = pixelToTile(collisionPos.y);

	var nx = this.position.x % map.TILE;
	var ny = this.position.y % map.TILE;
	
	var cell = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty+1);
	
	if(this.direction == RIGHT)
	{
		if(!cell && (cell_right && nx))
			this.direction = LEFT;
		
		
		if(cell_down && (!cell_diag && nx))
			this.direction = LEFT;
		
	}
	else
	{
		if(cell && (!cell_right && nx))
			this.direction = RIGHT;
		
		
		if(!cell_down && (cell_diag && nx))
			this.direction = RIGHT;
		
	}
}

Enemy.prototype.draw = function (offsetX, offsetY) 
{
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY);
}