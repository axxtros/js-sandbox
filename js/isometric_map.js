//dungeon generator
//27/05/2019 axtros@gmail.com

var DEBUG_DRAW_MAP_TILE_COORDS = true;

var MAP_ROW_WIDTH = 21;
var MAP_ROW_HEIGHT = 21;
var ISOMETRIC_TILE_WIDTH = 60;
var MAP_TOP_TILE_X =  630; //Math.round(mapCanvasPos.width / 2);
var MAP_TOP_TILE_Y = Math.round(ISOMETRIC_TILE_WIDTH / 4);
var CANVAS_BACKGROUND_COLOR = '#fff';

var mapCanvas;
var mapContext;
var mapCanvasPos;
var mouseCanvas;
var mouseContext;

var mapMatrix = new Array();

function init_isometric_map() {
	initCanvases();

	mapMatrix = generateDungeon(MAP_ROW_WIDTH, MAP_ROW_HEIGHT, 3, 3, 3, 3, 10);

	drawDiamondIsometricMap(MAP_TOP_TILE_X, MAP_TOP_TILE_Y);
}

function initCanvases() {
	mapCanvas = document.getElementById("map-canvas-id");	
	mapContext = mapCanvas.getContext("2d");
	mapContext.scale(1, 1);

	mapCanvasPos = mapCanvas.getBoundingClientRect();	
	mapContext.fillStyle = CANVAS_BACKGROUND_COLOR;
	mapContext.fillRect(0, 0, mapCanvasPos.width, mapCanvasPos.height);	

	mouseCanvas = document.getElementById("mouse-canvas-id");
	mouseContext = mouseCanvas.getContext("2d");
	mouseContext.scale(1, 1);
	$('#mouse-canvas-id').css('position', 'absolute');
	$("#mouse-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#mouse-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#mouse-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#mouse-canvas-id").css({ height: mapCanvasPos.height + 'px' });
}

function drawDiamondIsometricMap(topTileX, topTileY) {	
	let tileX = topTileX;
	let tileY = topTileY;
	let originalX = tileX;
	let originalY = tileY;
	for(let row = 0; row != mapMatrix.length; row++) {
		for(let column = 0; column != mapMatrix[0].length; column++) {
			let tileColor = 'gray';
			switch(mapMatrix[row][column]) {
				case MAP_EMPTY_GRID: tileColor = MAP_EMPTY_COLOR; break;
				case MAP_MAZE_GRID: tileColor = MAP_MAZE_COLOR; break;
				case MAP_ROOM_GRID: tileColor = MAP_ROOM_COLOR; break;
				case MAP_DOOR_GRID: tileColor = MAP_DOOR_COLOR; break;
			}
			drawTile(mapContext, tileX, tileY, ISOMETRIC_TILE_WIDTH, tileColor, DEBUG_DRAW_MAP_TILE_COORDS ? row + ',' + column : '');		
			tileX -= (ISOMETRIC_TILE_WIDTH / 2);
			tileY += (Math.round(ISOMETRIC_TILE_WIDTH / 4));
		}
		tileX = originalX + ((row + 1) * (ISOMETRIC_TILE_WIDTH / 2));
		tileY = originalY + ((row + 1) * (Math.round(ISOMETRIC_TILE_WIDTH / 4)));
	}	
}

function mouseCursorPos(event) {
	var rect = mouseCanvas.getBoundingClientRect();
	let mouseX = event.clientX - rect.left;
	let mouseY = event.clientY - rect.top;
	mouseContext.clearRect(0, 0, 400, 100);  
  mouseContext.fillText("mouse cursor X:" + mouseX + ' Y:' +  mouseY, 5, 10);

  let mouseTilePosX = Math.floor((MAP_TOP_TILE_X - mouseX) / ISOMETRIC_TILE_WIDTH);
  let mouseTilePosY = ((mouseY*2)-((mapCanvasPos.height*ISOMETRIC_TILE_WIDTH)/2)+mouseX)/2; // Math.floor(MAP_TOP_TILE_Y - mouseY);

  mouseContext.fillText("map cursor X:" + mouseTilePosX + ' Y:' +  mouseTilePosY, 5, 20);
}

//draw ------------------------------------------------------------------------
function drawTile(canvasContext, x, y, width, color, text) {
	let tileHeight = (width / 2);	

	canvasContext.lineWidth = 1;
	canvasContext.beginPath();

	canvasContext.moveTo(x - (width / 2), y);
	canvasContext.lineTo(x, y - (tileHeight / 2));
	canvasContext.lineTo(x, y + (tileHeight / 2));	
	canvasContext.lineTo(x - (width / 2), y);

	canvasContext.lineTo(x, y - (tileHeight / 2));
	canvasContext.lineTo(x + (width / 2), y);
	canvasContext.lineTo(x, y + (tileHeight / 2));

	canvasContext.fillStyle = color;		
	canvasContext.closePath();   

	canvasContext.stroke();
	canvasContext.fill();

	canvasContext.fillStyle = 'black';
	canvasContext.fillText(text, x - 8, y + 3);
}