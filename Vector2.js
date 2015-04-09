var Vector2 = function(x, y)
{
	this.x = x;
	this.y = y;
	
	this.length = Math.sqrt(x*x + y*y);
};

Vector2.prototype.set = function(x,y)
{
	return new Vector2(x, y);
}

Vector2.prototype.add = function(vec){
	var result = new Vector2(this.x + vec.x, this.y + vec.y);
	
	return result;
}

Vector2.prototype.subtract = function(vec){
	var result = new Vector2(this.x - vec.x, this.y - vec.y);
	
	return result;
}

Vector2.prototype.multiply = function(vec){
	var result = new Vector2(this.x * vec.x, this.y * vec.y);
	
	return result;
}

Vector2.prototype.divide = function(vec){
	var result = new Vector2(this.x / vec.x, this.y / vec.y);
	
	return result;
}

Vector2.prototype.multiplyScalar = function(val){
	var result = new Vector2(this.x * val, this.y * val)
	
	return result;
}

Vector2.prototype.normalize = function(){
	var result = new Vector2(this.x / this.length, this.y / this.length);
	
	return result;
}

Vector2.prototype.toString = function(){
	return "(X: " + Math.round(this.x) + ", Y: " + Math.round(this.y) + ")";
}