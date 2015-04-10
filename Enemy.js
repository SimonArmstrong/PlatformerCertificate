var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy.png";
	
	this.position = new Vector2(80, 10);
	this.velocity = new Vector2(0, 0);
	this.direction = RIGHT;
};

Enemy.prototype.update = function(deltaTime) 
{
	var acceleration = new Vector2(0,0);
	var enemyAccel = 5000 * gameSpeed;
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
}

Enemy.prototype.draw = function (offsetX, offsetY) 
{
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY);
}