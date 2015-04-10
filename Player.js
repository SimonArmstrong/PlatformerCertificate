
var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMB = 6;

var ANIM_MAX = 7;

var Player = function() 
{
	//load up sprite instead of image
	this.sprite = new Sprite("ChuckNorris.png");
	
	//set up all animations
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/gameSpeed, 
		[0,1,2,3,4,5,6,7]);//Left idle animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/gameSpeed, 
		[8,9,10,11,12]);//Left jump animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/gameSpeed, 
		[13,14,15,16,17,18,19,20,21,22,23,24,25,26]);//Left walk animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/ gameSpeed, 
		[52,53,54,55,56,57,58,59]);//Right idle animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/ gameSpeed, 
		[60,61,62,63,64]);//Right jump animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/ gameSpeed, 
		[65,66,67,68,69,70,71,72,73,74,75,76,77,78]);//Right walk animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05/ gameSpeed, 
		[42,43,44,45,46,47,48,49,50,51]);//Climb animation

	this.position = new Vector2(277, 245);
	this.scale = new Vector2(159, 180);
	
	this.width = this.scale.x;
	this.height = this.scale.y;
	
	this.jumping = false;
	this.falling = false;
	this.onLadder = false;
	this.glideTime = 3;
	this.lives = 5;
	
	this.direction = LEFT;
	
	this.velocity = new Vector2(0, 0);
	this.angularVelocity = 0;
	this.rotation = 0;
	
	this.health = 100;
	
	for(var i = 0; i < ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -this.width/2, -this.height/2);
	}
};

Player.prototype.changeDirectionalAnimation = function(leftAnim, rightAnim)
{
	if(this.direction==LEFT)
	{
		if(this.sprite.currentAnimation != leftAnim)
		{
			this.sprite.setAnimation(leftAnim);
		}
	}
	else
	{
		if(this.sprite.currentAnimation != rightAnim)
		{
			this.sprite.setAnimation(rightAnim);
		}
	}
}

Player.prototype.update = function(deltaTime) 
{

	this.sprite.update(deltaTime);
	
	var acceleration = new Vector2(0, 0);
	var playerAccel = 5000 * gameSpeed;
	var playerDrag = 11;
	var jumpForce = 60000 /gameSpeed;
	var playerGravity = map.TILE * 9.8 * 9;
	
	acceleration.y = playerGravity;
	
	var collisionOffset = new Vector2(-16, this.height/6 - map.TILE);
	var collisionPos = this.position.add(collisionOffset);
	var tx = pixelToTile(collisionPos.x);
	var ty = pixelToTile(collisionPos.y);
	
	//var tx = pixelToTile(this.position.x);
	//var ty = pixelToTile(this.position.y);
	
	var nx = this.position.x % map.TILE;
	var ny = this.position.y % map.TILE;
	var cell_ladder = cellAtTileCoord(map.LAYER_LADDERS, tx, ty);
	//console.log(cell_ladder);
	if(keyboard.isKeyDown(keyboard.KEY_UP) && cell_ladder)
	{
		acceleration.y -= playerAccel;
		this.onLadder = true;
	}
	else
	{
		this.onLadder = false;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) && !this.onLadder)
	{
		acceleration.x -= playerAccel;
		this.direction = LEFT;
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) && !this.onLadder)
	{
		acceleration.x += playerAccel;
		this.direction = RIGHT;
	}
	
	if(this.velocity.y > 0)
	{
		this.falling = true;
		this.jumping = false;
	}
	else
	{
		this.falling = false;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping && !this.falling && !this.onLadder)
	{
		acceleration.y -= jumpForce;
		this.jumping = true;
	}
	if(this.falling && keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		this.glideTime -= deltaTime;
		console.log(this.glideTime);
		if(this.glideTime >= 0)
		{
			this.velocity.y = 40;
		}

	}
	
	if(keyboard.isKeyDown(keyboard.KEY_A))
	{
		//this.playerShoot();
	}

	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	//do animation logic
	
	if(this.jumping || this.falling)
	{
		this.changeDirectionalAnimation(ANIM_JUMP_LEFT, ANIM_JUMP_RIGHT);
	}
	else if(this.onLadder || (this.onLadder && this.jumping && this.falling))
	{
		this.sprite.setAnimation(ANIM_CLIMB);
		this.velocity.x = 0;
	}
	else
	{
		if(Math.abs(this.velocity.x) > 25)
		{
			this.changeDirectionalAnimation(ANIM_WALK_LEFT, ANIM_WALK_RIGHT);
		}
		else
		{
			this.changeDirectionalAnimation(ANIM_IDLE_LEFT, ANIM_IDLE_RIGHT);
		}
	}
	
	var cell = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty+1);
	
	if(this.velocity.y > 0)
	{
		if ((cell_down && !cell) || (cell_diag && !cell_right && nx))
		{
			this.position.y = tileToPixel(ty) - collisionOffset.y;
			if(this.velocity.y > 2000)
			{
				player.health -= 100 / this.velocity.y * 200;
			}
			this.velocity.y = 0;
			ny = 0;
			
			this.jumping = false;
			this.glideTime = 3;
		}
	}

	else if (this.velocity.y < 0)
	{
		if((cell && !cell_down) || (cell_right && !cell_diag && nx))
		{
			this.position.y = tileToPixel(ty + 1) - collisionOffset.y;
			this.velocity.y = 0;
			
			/*cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(map.LAYER_PLATFORMS, tx, ty+2);
			cell_diag = cellAtTileCoord(map.LAYER_PLATFORMS, tx+1, ty+2);
			*/
			ny = 0;
		}
	}
	
	if(this.velocity.x > 0)
	{
		if((cell_right && !cell) || (cell_diag && !cell_down && ny))
		{
			this.position.x = tileToPixel(tx) - collisionOffset.x;
			this.velocity.x = 0;
			//console.log("Hit: right");
			nx = 0;
		}
	}
	else if(this.velocity.x < 0)
	{
		if((cell && !cell_right) || (cell_down && !cell_diag && ny))
		{
			this.position.x = tileToPixel(tx+1) - collisionOffset.x;
			this.velocity.x = 0;
			
			nx = 0;
		}
	}
}

Player.prototype.playerShoot = function()
{
	var bullet = new Bullet();
}

Player.prototype.draw = function (offsetX, offsetY) 
{
	this.sprite.draw(context, this.position.x - offsetX, this.position.y - offsetY);
}