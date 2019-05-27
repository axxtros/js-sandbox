//dungeon generator
//27/05/2019 axtros@gmail.com

var MAP_BACKGROUND_COLOR = '#cccccc';

var MAZE_SIZE = 10;					//ekkor a mérete pixelben egy térkép egységnek
var MAP_EMPTY_GRID = 0;
var MAP_MAZE_GRID = 1;
var MAP_ROOM_GRID = 2;
var MAP_DOOR_GRID = 3;
var MAP_LONLEY_GRID = 5;
var MAP_GENERATED_START_GRID = 6;
var MAP_EMPTY_COLOR = '#cccccc';
var MAP_MAZE_COLOR = '#000000';
var MAP_ROOM_COLOR = '#669cff';
var MAP_DOOR_COLOR = '#e2a012';
var MAP_LONLEY_COLOR = '#ffff00';
var MAP_GENERATED_START_COLOR = 'green';

var mazeCanvas;
var mazeContext;

var mapMatrix = new Array();

var Cord = {
	row: 0,
	column: 0
}

var Room = {
	roomRow: 0,
	roomColumn: 0,
	roomWidth: 0,
	roomHeight: 0
}

var mapRooms = new Array();

function init_maze_generator() {
	 initCanvases();	
	 initMapMatrix(mazeCanvas.height / MAZE_SIZE, mazeCanvas.width / MAZE_SIZE);	 	 
	 
	 roomGenerator(mapMatrix, 3, 3, 9, 9, 5);

	 let isDone = false;
	 while (!isDone) {
	 	let possibleCoords = searchNewMazeStartTiles(mapMatrix, MAP_EMPTY_GRID);
	 	if(possibleCoords.length == 0) {
	 		isDone = true;
	 		continue;
	 	}
	 	let newStartCoord = possibleCoords[generateRandomNumber(0, possibleCoords.length - 1)];	 
	 	mazeGenerator(mapMatrix, newStartCoord.row, newStartCoord.column);	
	 }

	 searchDoorTiles(mapMatrix);	 	 
	 
	 //searchMapLonleyTiles(mapMatrix, MAP_MAZE_GRID, MAP_EMPTY_GRID);

	 drawMapMatrix(mazeCanvas, mazeContext, mapMatrix, MAZE_SIZE, MAP_MAZE_COLOR, MAP_ROOM_COLOR);
}

function initCanvases() {
	mazeCanvas = document.getElementById("maze-canvas-id");
	mazeContext = mazeCanvas.getContext("2d");
	mazeContext.scale(1, 1);

	let mazeCanvasPos = mazeCanvas.getBoundingClientRect();
	mazeContext.fillStyle = MAP_BACKGROUND_COLOR;
	mazeContext.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}

function initMapMatrix(row, column) {
	for(let i = 0; i != row; i++) {
		mapMatrix[i] = new Array();
		for(let j = 0; j != column; j++) {
			mapMatrix[i][j] = MAP_EMPTY_GRID;
		}
	}	
}

//room generator --------------------------------------------------------------
//roomMinWidth, roomMinHeight, roomMaxWidth, roomMaxHeight only odd number!
function roomGenerator(mapMatrix, roomMinWidth, roomMinHeight, roomMaxWidth, roomMaxHeight, attemptsNum) {	
	if(attemptsNum < 1 || attemptsNum > 1000) {
		attemptsNum = 100;
	}
	let maxRow = mapMatrix.length;
	let maxColumn = mapMatrix[0].length;
	for(let i = 0; i != attemptsNum; i++) {		
		let roomRow = generateRandomOddNumber(0, maxRow);
		let roomColumn = generateRandomOddNumber(0, maxColumn);
		let roomWidth = generateRandomOddNumber(roomMinWidth, roomMaxWidth);
		let roomHeight = generateRandomOddNumber(roomMinHeight, roomMaxHeight);
		let isReserved = false;
		if((roomRow + roomWidth < maxRow) && (roomColumn + roomHeight < maxColumn)) {
			for(let i = roomRow; i != roomRow + roomWidth; i++) {			
				for(let j = roomColumn; j != roomColumn + roomHeight; j++) {
					if(mapMatrix[i][j] != MAP_EMPTY_GRID) {
						isReserved = true;
						break;
					}
				}
			}
			if(!isReserved)	{	//szoba lehelyezése a map-re, és a későbbi door kiválasztáshoz egy kollekcióba
				let room = Object.create(Room);
				room.roomRow = roomRow;
				room.roomColumn = roomColumn;
				room.roomWidth = roomWidth;
				room.roomHeight = roomHeight;
				mapRooms.push(room);
				for(let i = roomRow; i != roomRow + roomWidth; i++) {			
					for(let j = roomColumn; j != roomColumn + roomHeight; j++) {						
						mapMatrix[i][j] = MAP_ROOM_GRID;							
					}
				}
			}
			//console.log('room roomRow: ' + roomRow + ' roomColumn: ' + roomColumn + ' roomWidth:' + roomWidth + ' roomHeight: ' + roomHeight);
		}		
	}
}

//maze generator --------------------------------------------------------------
function mazeGenerator(mapMatrix, startRow, startColumn) {
	let maxRow = mapMatrix.length;
	let maxColumn = mapMatrix[0].length;
	let cRow = startRow;
	let cColumn = startColumn;	
	let isDone = false;
	var moves = [];

	mapMatrix[cRow][cColumn] = MAP_MAZE_GRID;

	let mCord = Object.create(Cord);
	mCord.row = cRow;
	mCord.column = cColumn;
	
	moves.push(mCord);

	while(!isDone) {		

		let possibleDirections = "";		
		if(cRow - 2 > 0 && cRow - 2 < maxRow && mapMatrix[cRow - 2][cColumn] == MAP_EMPTY_GRID) {
			possibleDirections += 'N';
		}		
		if(cRow + 2 > 0 && cRow + 2 < maxRow && mapMatrix[cRow + 2][cColumn] == MAP_EMPTY_GRID) {
			possibleDirections += 'S';
		}		
		if(cColumn - 2 > 0 && cColumn - 2 < maxColumn && mapMatrix[cRow][cColumn - 2] == MAP_EMPTY_GRID) {
			possibleDirections += 'W';
		}		
		if(cColumn + 2 > 0 && cColumn + 2 < maxColumn && mapMatrix[cRow][cColumn + 2] == MAP_EMPTY_GRID) {
			possibleDirections += 'E';
		}

		if(possibleDirections.length > 1) {
			possibleDirections = possibleDirections[generateRandomNumber(0, possibleDirections.length - 1)];
		}

		if(possibleDirections != "") {
			switch(possibleDirections) {
				case 'N': 
					mapMatrix[cRow - 1][cColumn] = MAP_MAZE_GRID;					
					mapMatrix[cRow - 2][cColumn] = MAP_MAZE_GRID;
					cRow -= 2;				
				break;
				case 'S': 
					mapMatrix[cRow + 1][cColumn] = MAP_MAZE_GRID;
					mapMatrix[cRow + 2][cColumn] = MAP_MAZE_GRID;
					cRow += 2;				
				break;
				case 'W': 
					mapMatrix[cRow][cColumn - 1] = MAP_MAZE_GRID;
					mapMatrix[cRow][cColumn - 2] = MAP_MAZE_GRID;
					cColumn -= 2;				
				break;
				case 'E': 
					mapMatrix[cRow][cColumn + 1] = MAP_MAZE_GRID;
					mapMatrix[cRow][cColumn + 2] = MAP_MAZE_GRID;
					cColumn += 2;				
				break;
			}
			
			let mCord = Object.create(Cord);
			mCord.row = cRow;
			mCord.column = cColumn;	
			moves.push(mCord);

		}	else {
			var back = moves.pop();
			cRow = back.row;
	   	cColumn = back.column;	   	
		}

		if(cRow == startRow && cColumn == startColumn) {
			isDone = true;
		}
	}

}

//search new maze generator start grid ----------------------------------------
function searchNewMazeStartTiles(mapMatrix, gridType) {	
	let tileCoords = new Array();
	for(let row = 0; row != mapMatrix.length; row++) {		
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(isNewMazeTile(mapMatrix, row, column, gridType)) {				
				let sCord = Object.create(Cord);
				sCord.row = row;
				sCord.column = column;
				tileCoords.push(sCord);
				mapMatrix[row][column] = MAP_GENERATED_START_GRID;	//ideiglenes be kell írni a map-be, mert akkor ezeket a mezőket a következő vizsgálatkor már nem tekinti üresnek
				//console.log('sCord.row: ' + sCord.row + ' sCord.column: ' + sCord.column);
			}
		}			
	}
	//visszaírjuk az ideiglenes MAP_GENERATED_START_GRID-eket MAP_EMPTY_GRID-re
	for(let row = 0; row != mapMatrix.length; row++) {
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(mapMatrix[row][column] == MAP_GENERATED_START_GRID) {
				mapMatrix[row][column] = MAP_EMPTY_GRID;	
			}
		}
	}	
	return tileCoords;
}

function isNewMazeTile(mapMatrix, row, column, gridType) {
	if(mapMatrix[row][column] != gridType) {
		return;
	}
	let gridTypeCounter = 0;
	if(row > 0 && mapMatrix[row - 1][column] == gridType) {	//up
		gridTypeCounter++;
	}
	if(row < mapMatrix.length - 1 && mapMatrix[row + 1][column] == gridType) {	//down
		gridTypeCounter++;
	}
	if(column > 0 && mapMatrix[row][column - 1] == gridType) {	//left
		gridTypeCounter++;
	}
	if(row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == gridType) {	//right
		gridTypeCounter++;
	}	
	if(row > 0 && column - 1 >= 0 && mapMatrix[row - 1][column - 1] == gridType) {	//top-left
		gridTypeCounter++;
	}
	if(row > 0 && column + 1 <= mapMatrix[0].length && mapMatrix[row - 1][column + 1] == gridType) {	//top-right
		gridTypeCounter++;
	}

	if(row + 1 < mapMatrix.length && column - 1 >= 0 && mapMatrix[row + 1][column - 1] == gridType) {	//bottom-left
		gridTypeCounter++;
	}
	if(row + 1 < mapMatrix.length && column + 1 <= mapMatrix[0].length && mapMatrix[row + 1][column + 1] == gridType) {	//bottom-right
		gridTypeCounter++;
	}
	return gridTypeCounter == 8;
}

//lonley maze tiles deleted ---------------------------------------------------
function searchMapLonleyTiles(mapMatrix, sourceGridType, targetGridType) {
	for(let row = 0; row != mapMatrix.length; row++) {		
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(isSearchedTile(mapMatrix, row, column, sourceGridType, targetGridType)) {
				mapMatrix[row][column] = MAP_LONLEY_GRID;				
			}
		}
	}
}

function isSearchedTile(mapMatrix, row, column, sourceGridType, targetGridType) {
	if(mapMatrix[row][column] != sourceGridType) {
		return;
	}
	let gridTypeCounter = 0;
	if(row > 0 && mapMatrix[row - 1][column] == targetGridType) {
		gridTypeCounter++;
	}
	if(row < mapMatrix.length - 1 && mapMatrix[row + 1][column] == targetGridType) {
		gridTypeCounter++;
	}
	if(column > 0 && mapMatrix[row][column - 1] == targetGridType) {
		gridTypeCounter++;
	}
	if(row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == targetGridType) {
		gridTypeCounter++;
	}
	return gridTypeCounter == 3;
}

//door ------------------------------------------------------------------------
//door tile: between (maze and room) or (room and room)
function searchDoorTiles(mapMatrix) {
	for(let row = 0; row != mapMatrix.length; row++) {		
		for(let column = 0; column != mapMatrix[0].length; column++) {
			if(isDoorTile(mapMatrix, row, column)) {
				mapMatrix[row][column] = MAP_DOOR_GRID;
			}
		}
	}
}

function isDoorTile(mapMatrix, row, column) {	
	if(mapMatrix[row][column] != MAP_EMPTY_GRID)	{
		return;
	}
	//a felső maze az alsó room vagy fordítva	
	if( ((row > 0 && mapMatrix[row - 1][column] == MAP_MAZE_GRID) && (row < mapMatrix.length - 1 > 0 && mapMatrix[row + 1][column] == MAP_ROOM_GRID)) ||
				((row > 0 && mapMatrix[row - 1][column] == MAP_ROOM_GRID) && (row < mapMatrix.length - 1 > 0 && mapMatrix[row + 1][column] == MAP_MAZE_GRID)) ) {
		return true;
	}
	//két szoba, alul, felül
	if( ((row > 0 && mapMatrix[row - 1][column] == MAP_ROOM_GRID) && (row < mapMatrix.length - 1 > 0 && mapMatrix[row + 1][column] == MAP_ROOM_GRID)) ) {
		return true;
	}
	//a bal maze, a jobb room vagy fordítva
	if( ((column > 0 && mapMatrix[row][column - 1] == MAP_MAZE_GRID) && (row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == MAP_ROOM_GRID)) || 
				((column > 0 && mapMatrix[row][column - 1] == MAP_ROOM_GRID) && (row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == MAP_MAZE_GRID)) ) {
		return true;
	}
	//két szoba, balra, jobbra
	if( ((column > 0 && mapMatrix[row][column - 1] == MAP_ROOM_GRID) && (row < mapMatrix[0].length - 1 && mapMatrix[row][column + 1] == MAP_ROOM_GRID)) ) {
		return true;
	}
	return false;	
}

//draws -----------------------------------------------------------------------
function drawMapMatrix(canvas, canvasContext, mapMatrix, mazeSize) {	
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
			} else if(mapMatrix[y][x] == MAP_GENERATED_START_GRID) {
				mazeColor = MAP_GENERATED_START_COLOR;
			}	else {
				mazeColor = MAP_EMPTY_COLOR;
			}
			drawRectangle(mazeContext, x * mazeSize, y * mazeSize, mazeSize, mazeColor);
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