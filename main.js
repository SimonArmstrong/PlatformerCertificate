
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var gameSpeed = 1;
var uiStyle = true;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";

var map = new Map(testLevel, "tileset.png");
var keyboard = new Keyboard();
var player = new Player();
var enemy = new Enemy();

var bg_music = new Howl
	({
		urls:["background.ogg"],
		loop:true,
		buffer:true,
		volume:0.5
	});
bg_music.play();
var timer = 300;

canvas.width = 960;
canvas.height = map.MAP_HEIGHT;

var cells = [];
function inititalizeCollision()
{
	for(var layerIdx = 0; layerIdx < map.layerCount; layerIdx++)
	{
		cells[layerIdx] = [];
		var idx = 0;
		//loop through each row
		for(var y = 0; y < map.level.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			//loop through each cell
			for(var x = 0; x < map.level.layers[layerIdx].width; x++)
			{
				if(map.level.layers[layerIdx].data[idx] != 0)
				{
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x+1] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y-1][x] = 1;
				}
				else if(cells[layerIdx][y][x] != 1)
				{
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

function tileToPixel(tile_coord)
{
	return tile_coord * map.TILE;
}

function pixelToTile(pixel)
{
	return Math.floor(pixel / map.TILE);
}

function cellAtTileCoord(layer, tx, ty)
{
	if(tx < 0 || tx >= map.MAP_TILE_WIDTH || ty < 0)
	{
		return 1;
	}
	
	if(ty >= map.MAP_TILE_HEIGHT)
	{
		return 0;
	}
	
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	   
	return cellAtTileCoord(layer, tx, ty);
}

function run()
{
	if(enemy.position.x < 0)
	{
		enemy.position.x = 0;
	}
	if(enemy.position.y < 0)
	{
		enemy.position.y = 0;
	}
	if(enemy.position.y > canvas.height)
	{
		enemy.position.y = canvas.height;
	}
	if(enemy.position.x > map.MAP_WIDTH)
	{
		enemy.position.x = map.MAP_WIDTH;
	}
	
	context.fillStyle = "#579"
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var xScroll = player.position.x - canvas.width/2;
	
	if(xScroll < 0)
		xScroll = 0;
	if(xScroll >= map.MAP_WIDTH - canvas.width)
		xScroll = map.MAP_WIDTH - canvas.width;
		
	map.drawMap(xScroll, 0);
	
	var deltaTime = getDeltaTime() * gameSpeed;
	
	timer -= deltaTime;

	enemy.update(deltaTime);
	enemy.draw(xScroll, 0);
		
	player.update(deltaTime);
	player.draw(xScroll, player.position.y/canvas.height);
	
	if(1) // Use 0 to switch HUD 1 to HUD 2
	{
		var staticHUD = document.createElement("img");
		staticHUD.src = "hudMain.png";
		var healthHUD = document.createElement("img");
		healthHUD.src = "healthBar.png";
		context.drawImage(healthHUD, 5, 5, player.health * 1.85, 50);
		context.drawImage(staticHUD, 5, 5, 184, 50);
		context.fillStyle = "#999";
		context.font = "10px Arial";
		context.fillText(Math.round(timer), 68, 38, 30);
	}
	else
	{
		var staticHUD = document.createElement("img");
		staticHUD.src = "hudMainB.png";
		var healthHUD = document.createElement("img");
		healthHUD.src = "lifeImage.png";
		context.drawImage(staticHUD, 0, 5, 184 * 2, 100);
		
		for(var i = 0; i < player.lives; i++)
		{
			context.drawImage(healthHUD, 8 + (i * 44), 14, 24, 24);
		}
	}
	
	if(player.position.y > canvas.height)
	{
		player.health -= 5;
		if(player.health <= 0)
		{
			player.position = new Vector2(canvas.width/2, 245);
			player.health = 100;
			player.velocity.y =0;
			player.lives--;
		}
	}
	//console.log(player.position.toString());

	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	//player.position.x = document.getElementById("playerx").value;
	//player.position.y = document.getElementById("playery").value;
		
	// draw the FPS
	//context.fillStyle = "#f00";
	//context.font="14px Arial";
	//context.fillText("FPS: " + fps, 5, 20, 100);
	//context.fillText("PlayerPos: " + player.position.toString(), 5, 40, 1000);
	//context.fillText("EnemyPos: " + enemy.position.toString(), 5, 60, 1000);
}
inititalizeCollision();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
