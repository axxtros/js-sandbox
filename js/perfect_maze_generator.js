//perfect maze generator
//22/05/2019 axtros@gmail.com

var DEBUG_ENABLED_MAP_GRID = false;

var MAP_BACKGROUND_COLOR = '#cccccc';
var MAP_GRID_COLOR = '#1f3852';

var MAZE_SIZE = 10;					//ennyi pixel a canvas-en egy térkép matrix egység
var MAZE_COLOR = '#000000';
var CURSOR_COLOR = '#ff0000';
var MAP_EMPTY_GRID = 0;

var mazeCanvas;
var mazeContext;

var mapMatrix = new Array();

function init_maze_generator() {
	 initCanvases();	
	 initMapMatrix(mazeCanvas.width / MAZE_SIZE, mazeCanvas.height / MAZE_SIZE); //81x61
	 //writeToConsoleMapMatrix(mazeCanvas.width / MAZE_SIZE, mazeCanvas.height / MAZE_SIZE);
	 mazeGenerator(mapMatrix, 59, 1);	 
}

function initCanvases() {
	mazeCanvas = document.getElementById("maze-canvas-id");
	mazeContext = mazeCanvas.getContext("2d");
	mazeContext.scale(1, 1);

	let mazeCanvasPos = mazeCanvas.getBoundingClientRect();
	mazeContext.fillStyle = MAP_BACKGROUND_COLOR;
	mazeContext.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);

	if(DEBUG_ENABLED_MAP_GRID) {
		let mapWidth = 0;
		let mapHeight = 0;
		//kockás háttér rajzolása
		for(let x = 0; x != mazeCanvas.width; x += MAZE_SIZE) {
			drawLine(mazeContext, x, 0, x, mazeCanvas.height, MAP_GRID_COLOR);
			mapWidth++;
		}
		for(let y = 0; y != mazeCanvas.height; y += MAZE_SIZE) {
			drawLine(mazeContext, 0, y, mazeCanvas.width, y, MAP_GRID_COLOR);
			mapHeight++;
		}
	}	
}

function initMapMatrix(width, height) {
	for(let i = 0; i != height; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != width; j++) {
			mapMatrix[i][j] = 0;
		}
	}	
}

//maze generator --------------------------------------------------------------
function mazeGenerator(mapMatrix, startMX, startMY) {
	let currX = 1;	//startMX;
	let currY = 80; //startMY;
	let isDone = false;	
	mapMatrix[currX][currY] = 1;	
		
	console.log('currX: ' + currX + ' currY: ' + currY + ' mapMatrix[currX + 2][currY]: ' + mapMatrix[currX][currY]);

	//drawRectangle(mazeContext, currX * MAZE_SIZE, currY * MAZE_SIZE, MAZE_SIZE, MAZE_COLOR);
	drawMapMatrix(mazeCanvas, mazeContext, mapMatrix, MAZE_SIZE, MAZE_COLOR);

}

//draws -----------------------------------------------------------------------
function drawMapMatrix(canvas, canvasContext, mapMatrix, mazeSize, color) {
	let width = mapMatrix[0].length;
	let height = mapMatrix.length;
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = MAP_BACKGROUND_COLOR;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for(let y = 0; y != height; y++) {		
		for(let x = 0; x != width; x++) {
			console.log('x: ' + x + ' y:' + y);
			if(mapMatrix[x][y] != 0) {
				drawRectangle(mazeContext, x * mazeSize, y * mazeSize, mazeSize, color);
			}
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