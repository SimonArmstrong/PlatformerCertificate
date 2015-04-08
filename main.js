
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


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";

var keyboard = new Keyboard();
var player = new Player();
var enemy = new Enemy();

var layerCount = 6;
var MAP = {tw: 20, th: 25};
var TILE = 35;				//The Tile Dimensions on the X and Y
var TILESET_TILE = TILE*2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;	//Tiles along the x on the tileset image
var TILESET_COUNT_Y = 14;	//Tiles along the y on the tileset image

var MAP_WIDTH = (MAP.tw * TILE);
var MAP_HEIGHT = (MAP.th * TILE);
canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT;

var tileset = document.createElement("img");
tileset.src = "tileset.png";

function drawMap()
{
	for(var layerIdx = 0; layerIdx < layerCount; layerIdx++)
	{
		var idx = 0;
		for(var y = 0; y < testLevel.layers[layerIdx].height; y++)
		{
			for(var x = 0; x < testLevel.layers[layerIdx].width; x++)
			{
				if(testLevel.layers[layerIdx].data[idx] != 0)
				{
					var tileIndex = testLevel.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_PADDING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_PADDING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}


function run()
{
	drawMap();
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	player.draw();
	
	enemy.update(deltaTime);
	enemy.draw();
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
	player.position.x = document.getElementById("playerx").value;
	player.position.y = document.getElementById("playery").value;
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	context.fillText("PlayerPos: " + player.position.toString(), 5, 40, 100);
	context.fillText("EnemyPos: " + enemy.position.toString(), 5, 60, 100);
}

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
