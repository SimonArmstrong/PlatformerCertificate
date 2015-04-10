var Bullet = function()
{
	this.position = new Vector2(player.position.x, player.position.y);
	this.acceleration = new Vector2(0, 0);
	
	if(player.direction == LEFT)
	{
		this.acceleration.x -= 25000;
	}
	else
	{
		this.acceleration.x += 25000;
	}
	this.image = document.createElement("img");
	this.image.src = "bullet.png";
	
	context.drawImage(this.image, this.position.x + 200, this.position.y, 6, 6);
}