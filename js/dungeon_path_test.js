//dunegon_path_test

var MAP_BACKGROUND_COLOR = '#000000';
var MAZE_SIZE = 5;					//ekkor a mérete pixelben egy térkép egységnek

var TEST_DUNGEON_ROWS = 161;
var TEST_DUNGEON_COLUMNS = 161;

var dungeonCanvas;
var dungeonContext;
var mapMatrix = new Array();


function init() {
  initCanvases();
  initTest();
}

function initCanvases() {
	dungeonCanvas = document.getElementById("dungeon-canvas-id");
	dungeonContext = dungeonCanvas.getContext("2d");
	dungeonContext.scale(1, 1);

	let dungeonCanvasPos = dungeonCanvas.getBoundingClientRect();
	dungeonContext.fillStyle = MAP_BACKGROUND_COLOR;
	dungeonContext.fillRect(0, 0, dungeonCanvas.width, dungeonCanvas.height);
}

function initTest() {
  mapMatrix = generateDungeon(TEST_DUNGEON_ROWS, TEST_DUNGEON_COLUMNS, 3, 5, 3, 5, 200);  
  let startTile = selectedPathPoint();
	let endTile = selectedPathPoint();
	
	// mapMatrix[startTile.row][startTile.column] = MAP_START_TILE;
	// mapMatrix[endTile.row][endTile.column] = MAP_END_TILE;

	searchPathWithAStar(mapMatrix, startTile.row, startTile.column, endTile.row, endTile.column);

	for(let i = 0; i != path.length; i++) {
		mapMatrix[path[i].row][path[i].column] = MAP_PATH_CLOSE_TILE;
	}

	mapMatrix[startTile.row][startTile.column] = MAP_START_TILE;
	mapMatrix[endTile.row][endTile.column] = MAP_END_TILE;

  drawTestMatrix(dungeonCanvas, dungeonContext, mapMatrix, MAZE_SIZE, false);
}

function selectedPathPoint() {
  let resultTile = Object.create(Tile);
  do {    
    resultTile.row = generateRandomNumber(0, TEST_DUNGEON_ROWS);
    resultTile.column = generateRandomNumber(0, TEST_DUNGEON_ROWS);
  } while(!(mapMatrix[resultTile.row][resultTile.column] == MAP_MAZE_GRID || 
          mapMatrix[resultTile.row][resultTile.column] == MAP_ROOM_GRID || 
          mapMatrix[resultTile.row][resultTile.column] == MAP_DOOR_GRID)); 
  return resultTile;
}

//draws -----------------------------------------------------------------------
function drawTestMatrix(canvas, canvasContext, mapMatrix, mazeSize, isOneColor) {	
	let row = mapMatrix.length;
	let column = mapMatrix[0].length;
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = MAP_BACKGROUND_COLOR;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for(let y = 0; y != row; y++) {		
		for(let x = 0; x != column; x++) {
			let mazeColor = '';
			if(mapMatrix[y][x] == MAP_MAZE_GRID) {
				mazeColor = MAP_MAZE_COLOR;
			} else if(mapMatrix[y][x] == MAP_ROOM_GRID) {
				mazeColor = MAP_ROOM_COLOR;
			} else if(mapMatrix[y][x] == MAP_LONLEY_GRID) {
				mazeColor = MAP_LONLEY_COLOR;
			} else if(mapMatrix[y][x] == MAP_DOOR_GRID) {
				mazeColor = MAP_DOOR_COLOR;
			} else if(mapMatrix[y][x] == MAP_MAZE_POSSIBLE_START_GRID) {
				mazeColor = MAP_GENERATED_START_COLOR;

			} else if(mapMatrix[y][x] == MAP_START_TILE) {
				mazeColor = 'white';
			} else if(mapMatrix[y][x] == MAP_END_TILE) {
				mazeColor = 'green';
			} else if(mapMatrix[y][x] == MAP_PATH_CLOSE_TILE) {
				mazeColor = 'red';

			}	else {
				mazeColor = MAP_EMPTY_COLOR;
			}
			if(mazeColor != MAP_EMPTY_COLOR && isOneColor) {
				mazeColor = '#bdb8ae';
			}
			drawRectangle(canvasContext, x * mazeSize, y * mazeSize, mazeSize, mazeColor);
		}
	}
}
