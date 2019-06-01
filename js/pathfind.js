//pathfind.js
//A* pathfind algorithm

var MAZE_SIZE = 10;

var MAP_START_GRID = 1;
var MAP_END_GRID = 2;
var MAP_WALL_GRID = 3;
var MAP_EMPTY_GRID = 4;
var MAP_PATH_GRID = 5;

var mapCanvas;
var mapContext;

var mapMatrix = new Array();

var Cord = {
	row: 0,
	column: 0
}

function init_pathfind() {
	initCanvas();
	initMap();
}

function initCanvas() {
	mapCanvas = document.getElementById("map-canvas-id");
	mapContext = mapCanvas.getContext("2d");
	mapContext.scale(1, 1);
}

function initMap() {	
	initMapMatrix(20, 20);

	mapMatrix[5][1] = MAP_START_GRID;	

	mapMatrix[4][5] = MAP_WALL_GRID;
	mapMatrix[5][5] = MAP_WALL_GRID;
	mapMatrix[6][5] = MAP_WALL_GRID;

	mapMatrix[5][9] = MAP_END_GRID;	

	searchPathWithAStar(mapMatrix, 5, 1, 5, 9, MAP_EMPTY_GRID);

	drawMapMatrix(mapCanvas, mapContext, mapMatrix, MAZE_SIZE, false);
}

function initMapMatrix(row, column) {
	for(let i = 0; i != row; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != column; j++) {
			mapMatrix[i][j] = MAP_EMPTY_GRID;
		}
	}	
}

//A* pathfind -----------------------------------------------------------------
function searchPathWithAStar(mapMatrix, fromRow, fromColumn, toRow, toColumn, pathGridType) {
	if(mapMatrix === 'undefinded' || mapMatrix.length == 0 || mapMatrix[0].length == 0 &&
		fromRow == toRow && fromColumn == toColumn)
		return;
	
	let path = new Array;
	let startCoord = new Object(Cord);
	startCoord.row = fromRow;
	startCoord.column = fromColumn;
	path.push(startCoord);

	let isDone = false;
	while(!isDone) {



		isDone = true;
	}

}

function searchPissibleTiles(parentTile, path) {
	
}


//draws -----------------------------------------------------------------------
function drawMapMatrix(canvas, canvasContext, mapMatrix, mazeSize, isOneColor) {	
	let row = mapMatrix.length;
	let column = mapMatrix[0].length;
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for(let y = 0; y != row; y++) {		
		for(let x = 0; x != column; x++) {
			let mazeColor = '';
			if(mapMatrix[y][x] == MAP_START_GRID) {
				mazeColor = 'red';
			} else if(mapMatrix[y][x] == MAP_END_GRID) {
				mazeColor = 'green';
			} else if(mapMatrix[y][x] == MAP_WALL_GRID) {
				mazeColor = 'gray';
			} else if(mapMatrix[y][x] == MAP_EMPTY_GRID) {
				mazeColor = 'black';
			} else if(mapMatrix[y][x] == MAP_PATH_GRID) {
				mazeColor = 'white';
			}	else {
				mazeColor = 'blue';
			}			
			drawRectangle(canvasContext, x * mazeSize, y * mazeSize, mazeSize, mazeColor);
		}
	}
}

function drawLine(canvasContext, x1, y1, x2, y2, color) {
	canvasContext.beginPath();
	canvasContext.lineWidth = 1;
	canvasContext.fillStyle = '#000000';
	canvasContext.strokeStyle = color;
	canvasContext.moveTo(x1, y1);
	canvasContext.lineTo(x2, y2);	
	canvasContext.closePath();
	canvasContext.stroke();
}

function drawRectangle(canvasContext, x, y, size, color) {	
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, size, size);	
}