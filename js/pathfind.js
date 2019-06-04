//pathfind.js
//A* pathfind algorithm

var MAZE_SIZE = 10;
var ENABLED_DIAGONAL_MOVE = true;

var MAP_START_GRID = 1;
var MAP_END_GRID = 2;

var MAP_WALL_GRID = 3;
var MAP_EMPTY_GRID = 4;

var MAP_PATH_GRID = 5;

var mapCanvas;
var mapContext;

var mapMatrix = new Array();
var enabledGridTypes = new Array(MAP_EMPTY_GRID);			//olyan grid típusok, amelyekre lehet számolni path-et
var disabledGridTypes = new Array(MAP_WALL_GRID);			//olyan grid típusok, amelyekre nem lehet számolni path-et

var Tile = {
	row: 0,
	column: 0,
	type: 0,
	parent: Tile,
	cost: 0,
	g: 0,
	h: 0,
	f: (this.g + this.h)
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

	startRow = 4;
	startColumn = 2;

	mapMatrix[startRow][startColumn] = MAP_START_GRID;

	mapMatrix[4][5] = MAP_WALL_GRID;
	mapMatrix[5][5] = MAP_WALL_GRID;
	mapMatrix[6][5] = MAP_WALL_GRID;

	mapMatrix[6][9] = MAP_END_GRID;	

	searchPathWithAStar(mapMatrix, startRow, startColumn, 6, 9);

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

//http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function searchPathWithAStar(mapMatrix, fromRow, fromColumn, toRow, toColumn) {
	if(mapMatrix === 'undefinded' || mapMatrix.length == 0 || mapMatrix[0].length == 0 || (fromRow == toRow && fromColumn == toColumn))
		return;
	
	let path = new Array();

	let startTile = Object.create(Tile);
	startTile.row = fromRow;
	startTile.column = fromColumn;
	startTile.parent = null;
	startTile.g = 0;
	startTile.h = 0;
	path.push(startTile);

	let goalTile = Object.create(Tile);
	goalTile.row = toRow;
	goalTile.column = toColumn;

	let isDone = false;
	while(!isDone) {

		tiles = searchPossibleTiles(mapMatrix, startTile, goalTile);
		

		isDone = true;
	}

}

function searchPossibleTiles(mapMatrix, tile, goalTile) {
	let possibleTiles = new Array();
	let mTile = null;
	let minH = 0;

	if(tile.row > 0 && mapMatrix[tile.row - 1][tile.column] == MAP_EMPTY_GRID ) {
		possibleTiles.push(addPossibleTile(tile.row - 1, tile.column, tile, goalTile));
	}
	if(tile.row + 1 < mapMatrix.length && mapMatrix[tile.row + 1][tile.column] == MAP_EMPTY_GRID ) {
		possibleTiles.push(addPossibleTile(tile.row + 1, tile.column, tile, goalTile));	
	}
	if(tile.column > 0 && mapMatrix.length && mapMatrix[tile.row][tile.column - 1] == MAP_EMPTY_GRID ) {
		possibleTiles.push(addPossibleTile(tile.row, tile.column - 1, tile, goalTile));
	}
	if(tile.column + 1 < mapMatrix[0].length && mapMatrix.length && mapMatrix[tile.row][tile.column + 1] == MAP_EMPTY_GRID ) {
		possibleTiles.push(addPossibleTile(tile.row, tile.column + 1, tile, goalTile));
	}

	let minIndex = 0;
	for(let i = 0; i != possibleTiles.length; i++) {
		if(i == 0) {			
			minTile = possibleTiles[i];			
		} else {
			if(possibleTiles[i].h < minTile.h) {				
				minTile = possibleTiles[i];				
				minIndex = i;
			}
		}
	}

	possibleTiles.splice(minIndex, minIndex);

	return {
		possibleTiles: possibleTiles,
		minTile: minTile
	}
		
}

function addPossibleTile(row, column, parentTile, goalTile) {
	let tile = Object.create(Tile);
	tile.row = row;
	tile.column = column;
	tile.parent = parentTile;
	tile.g = manhattanDistanceCalc(tile, parentTile, 1);
	tile.h = manhattanDistanceCalc(tile, goalTile, 1);
	tile.f = (tile.g + tile.h);
	return tile;
}

//ha a tile típusok között költség van, akkor azt is a costMove-ba kell beletenni
function manhattanDistanceCalc(tile, goalTile, costSquareMove) {		//The standard heuristic for a square grid. (http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html)
	dx = Math.abs(tile.column - goalTile.column);
  dy = Math.abs(tile.row - goalTile.row);
  return costSquareMove * (dx + dy);
}

function diagonalDistanceCalc(tile, goalTile, costMove, costDiagonalMove) {		//If your map allows diagonal movement you need a different heuristic. (http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html)
	dx = Math.abs(tile.column - goalTile.column);
  dy = Math.abs(tile.row - goalTile.row);
  return costMove * (dx + dy) + (costDiagonalMove - 2 * costMove) * Math.min(dx, dy);
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