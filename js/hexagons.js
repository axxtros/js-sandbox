//hexagons tanulmányok
//04/10/2019 axtros@gmail.com

//https://www.redblobgames.com/grids/hexagons/

var MAP_BACKGROUND_COLOR = '#cccccc';

var hexagonCanvas;
var hexagonContext;

function initHexagons() {
  initCanvases();  

  var point1 = calcFlatHexCoord(100, 100, 30, 1);  
  var point2 = calcFlatHexCoord(100, 100, 30, 2);  
  var point3 = calcFlatHexCoord(100, 100, 40, 3);  
  var point4 = calcFlatHexCoord(100, 100, 30, 4);  
  var point5 = calcFlatHexCoord(100, 100, 30, 5);  
  var point6 = calcFlatHexCoord(100, 100, 40, 6);

  drawPoint(hexagonContext, 100, 100, 'red', 'S');
  drawPoint(hexagonContext, point1.x, point1.y, '#000', '1');
  drawPoint(hexagonContext, point2.x, point2.y, '#000', '2');
  drawPoint(hexagonContext, point3.x, point3.y, '#000', '3');
  drawPoint(hexagonContext, point4.x, point4.y, '#000', '4');
  drawPoint(hexagonContext, point5.x, point5.y, '#000', '5');
  drawPoint(hexagonContext, point6.x, point6.y, '#000', '6');

  
  drawLine(hexagonContext, point1.x, point1.y, point2.x, point2.y, '#000');
  drawLine(hexagonContext, point2.x, point2.y, point3.x, point3.y, '#000');
  drawLine(hexagonContext, point3.x, point3.y, point4.x, point4.y, '#000');
  drawLine(hexagonContext, point4.x, point4.y, point5.x, point5.y, '#000');
  drawLine(hexagonContext, point5.x, point5.y, point6.x, point6.y, '#000');
  drawLine(hexagonContext, point6.x, point6.y, point1.x, point1.y, '#000');  
  
  /*
  var hexaSize = 40;
  //ponttal lefelé 
  var pointyHexFirstCoordX = 50;
  var pointyHexFirstCoordY = 50; 
  var isPointyHex = true; 
  drawHexagon(isPointyHex, pointyHexFirstCoordX, pointyHexFirstCoordY, hexaSize, '#000');  
  drawHexagon(isPointyHex, pointyHexFirstCoordX + getPointyHexaWidth(hexaSize), pointyHexFirstCoordY, hexaSize, 'red');
  drawHexagon(isPointyHex, pointyHexFirstCoordX + getPointyHexaWidth(hexaSize) / 2, pointyHexFirstCoordY + getPointyHexaHeight(hexaSize), hexaSize, 'green');  
  */

  //éllel lefelé
  var hexaSize = 40;
  var pointyFlatFirstCoordX = 50;
  var pointyFlatFirstCoordY = 200;  
  isPointyHex = false;
  drawHexagon(isPointyHex, pointyFlatFirstCoordX, pointyFlatFirstCoordY, hexaSize, '#000');  
  //drawHexagon(isPointyHex, pointyFlatFirstCoordX + getFlatHexaWidth(hexaSize), pointyFlatFirstCoordY + getFlatHexaHeight(hexaSize) / 2, hexaSize, 'red');
  //drawHexagon(isPointyHex, pointyFlatFirstCoordX, pointyFlatFirstCoordY + getFlatHexaHeight(hexaSize), hexaSize, 'green');  
  
}

function initCanvases() {
	hexagonCanvas = document.getElementById("hexagon-canvas-id");
	hexagonContext = hexagonCanvas.getContext("2d");
	hexagonContext.scale(1, 1);

	hexagonContext.fillStyle = MAP_BACKGROUND_COLOR;
	hexagonContext.fillRect(0, 0, hexagonCanvas.width, hexagonCanvas.height);
}

function drawHexagon(isPointyHex, centerX, centerY, size, color) {
  var tempPoint = isPointyHex ? calcPointyHexCoord(centerX, centerY, size, 1) : calcFlatHexCoord(centerX, centerY, size, 1);
  for(let i = 2; i != 8; i++) {    
    var point = isPointyHex ? calcPointyHexCoord(centerX, centerY, size, i) : calcFlatHexCoord(centerX, centerY, size, i);
    drawLine(hexagonContext, tempPoint.x, tempPoint.y, point.x, point.y, color);
    tempPoint = point;
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

function drawPoint(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, 5, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = color;
	canvasContext.fill();
	canvasContext.closePath();
	drawPointSymbol(canvasContext, x, y, color, symbol);
}

function drawPointSymbol(canvasContext, x, y, color, symbol) {
	canvasContext.beginPath();
	canvasContext.font = "12px Arial";
	canvasContext.strokeStyle = color;
	canvasContext.fillText(symbol, x - 4, y - 6);
	canvasContext.stroke();
	canvasContext.closePath();
}