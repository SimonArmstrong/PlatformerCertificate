var Player = function() 
{
	this.image = document.createElement("img");
	
	this.position = new Vector2(80, canvas.height / 2);

	this.scale = new Vector2(159, 163);
	
	this.width = this.scale.x;
	this.height = this.scale.y;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime) 
{
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		//this.rotation += deltaTime; 
	}
	else
	{
		//this.rotation -= deltaTime; 
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