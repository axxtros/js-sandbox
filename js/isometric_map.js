//dungeon generator
//27/05/2019 axtros@gmail.com

var DEBUG_DRAW_MAP_TILE_COORDS = true;

var MAP_ROW_WIDTH = 21;
var MAP_ROW_HEIGHT = 21;
var ISOMETRIC_TILE_WIDTH = 60;
var ISOMETRIC_TILE_HEIGHT = ISOMETRIC_TILE_WIDTH / 2;
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
	//drawStaggeredIsometricMap(30, ISOMETRIC_TILE_HEIGHT);
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
		tileX = originalX + ((row + 1) * (Math.round(ISOMETRIC_TILE_WIDTH / 2)));
		tileY = originalY + ((row + 1) * (Math.round(ISOMETRIC_TILE_WIDTH / 4)));
	}	
}

function drawStaggeredIsometricMap(topTileX, topTileY) {
	let tileX = topTileX;
	let tileY = topTileY;
	let originalX = tileX;
	let originalY = tileY;
	for(let column = 0; column != mapMatrix[0].length; column++) {
		for(let row = 0; row != mapMatrix.length; row++) {
			let tileColor = 'gray';			
			drawTile(mapContext, tileX, tileY, ISOMETRIC_TILE_WIDTH, tileColor, DEBUG_DRAW_MAP_TILE_COORDS ? row + ',' + column : '');
			tileX += ISOMETRIC_TILE_WIDTH;
		}
		if(column % 2 == 0) {
			tileX = originalX + ISOMETRIC_TILE_WIDTH / 2;
		} else {
			tileX = originalX;			
		}		
		tileY += ISOMETRIC_TILE_HEIGHT / 2;
	}
}

//https://2dengine.com/?p=isometric#Types_of_isometric_maps

function mouseCursorPos(event) {
	var rect = mouseCanvas.getBoundingClientRect();
	let mouseX = event.offsetX; // - rect.left;
	let mouseY = event.offsetY; // - rect.top;
	mouseContext.clearRect(0, 0, 400, 100);  
  mouseContext.fillText("mouse cursor X:" + mouseX + ' Y:' +  mouseY, 5, 10);
  
  /*
	tileX = Math.round( ((mouseX / (ISOMETRIC_TILE_WIDTH / 2)) + (mouseY / (ISOMETRIC_TILE_HEIGHT / 2))) / 2) - 11;
 	tileY = Math.round( ((mouseY / (ISOMETRIC_TILE_HEIGHT / 2)) - (mouseX / (ISOMETRIC_TILE_WIDTH/ 2))) / 2) + 10; 	 		
	*/

  //SEE: http://www.java-gaming.org/index.php?topic=38252.0
  tileX = Math.round( ((mouseX / (ISOMETRIC_TILE_WIDTH)) + (mouseY / (ISOMETRIC_TILE_HEIGHT))));// - 11;
 	tileY = Math.round( ((mouseY / (ISOMETRIC_TILE_HEIGHT)) - (mouseX / (ISOMETRIC_TILE_WIDTH))));// + 10;

 	mouseContext.fillText("map tile X: " + tileX + " Y: " +  tileY, 5, 20);

 	cMouseX = 0;
 	cMouseY = 0;

 	if(mouseX < MAP_TOP_TILE_X)
 		cMouseX = MAP_TOP_TILE_X - mouseX;
 	else
 		cMouseX =	Math.abs(MAP_TOP_TILE_X - mouseX);
 	
 	if(mouseY < (630 / 2)) 
 		cMouseY = (630 / 2) - mouseY;
 	else
 		cMouseY = Math.abs((630 / 2) - mouseY);
 	

	mouseContext.fillText("cMouseX: " + cMouseX + " cMouseY: " +  cMouseY, 5, 30); 	

 	mouse_grid_x = Math.floor((cMouseY / ISOMETRIC_TILE_HEIGHT) + (cMouseX / ISOMETRIC_TILE_WIDTH)) + Math.floor(MAP_ROW_WIDTH / 2);
	mouse_grid_y = Math.floor((-cMouseX / ISOMETRIC_TILE_WIDTH) + (cMouseY / ISOMETRIC_TILE_HEIGHT)) + Math.floor(MAP_ROW_HEIGHT / 2);

	mouseContext.fillText("map tile 2 X: " + mouse_grid_x + " Y: " +  mouse_grid_y, 5, 40);

/*
	x = 0.5 * ( mouseX / (ISOMETRIC_TILE_WIDTH / 2) + mouseY / (ISOMETRIC_TILE_HEIGHT / 2));
	y = 0.5 * (-mouseX / (ISOMETRIC_TILE_WIDTH / 2) + mouseY / (ISOMETRIC_TILE_HEIGHT / 2));

	mouseContext.fillText("map tile 3 X: " + x + " Y: " +  y, 5, 40);
*/ 	
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

	canvasContext.fillStyle = 'white';
	canvasContext.fillText(text, x - 8, y + 3);
}