var Map = function(level, tilesetImage)
{
	this.layerCount = level.layers.length;
	this.level = level;
	
	this.TILE = level.tileheight;	//The Tile Dimensions on the X and Y
	this.MAP_TILE_WIDTH = level.width;
	this.MAP_TILE_HEIGHT = level.height;
	this.MAP_WIDTH = level.width * this.TILE;
	this.MAP_HEIGHT = level.height * this.TILE;
	this.TILESET_TILE = level.tilesets[0].tileheight;
	this.TILESET_PADDING = level.tilesets[0].margin;
	this.TILESET_SPACING = level.tilesets[0].spacing;
	this.cameraOffset = 0;
	//this.LAYER_SKY = 0;
	//this.LAYER_BACKGROUND_FAR = 1;
	//this.LAYER_BACKGROUND_WALLS = 2;
	this.LAYER_BACKGROUND = 0;
	this.LAYER_PLATFORMS = 4;
	this.LAYER_LADDERS = 5;

	this.tileset = document.createElement("img");
	this.tileset.src = tilesetImage;
};

Map.prototype.drawMap = function(offsetX, offsetY)
{
	this.TILESET_COUNT_X = 14;	//Tiles along the x on the tileset image
	this.TILESET_COUNT_Y = 14;	//Tiles along the y on the tileset image
	for(var layerIdx = 0; layerIdx < this.layerCount; layerIdx++)
	{
		var idx = 0;
		for(var y = 0; y < this.level.layers[layerIdx].height; y++)
		{
			for(var x = 0; x < this.level.layers[layerIdx].width; x++)
			{
				if(this.level.layers[layerIdx].data[idx] != 0 && this.level.layers[layerIdx].visible == true)
				{
					var tileIndex = this.level.layers[layerIdx].data[idx] - 1;
					var sx = this.TILESET_PADDING + (tileIndex % this.TILESET_COUNT_X) * (this.TILESET_TILE + this.TILESET_PADDING);
					var sy = this.TILESET_PADDING + (Math.floor(tileIndex/this.TILESET_COUNT_Y)) * (this.TILESET_TILE + this.TILESET_PADDING);
					context.drawImage(this.tileset, sx, sy, this.TILESET_TILE, this.TILESET_TILE, x*this.TILE - offsetX, (y-1)*this.TILE - offsetY, this.TILESET_TILE, this.TILESET_TILE);
				}
				idx++;
			}
		}
	}
}