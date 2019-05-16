//game_2d_light_demo.js
//2D game light demo.
//16/05/2019 axtros@gmail.com

var SHAPE_COLOR = 'white';

var LIGHT_START_X = 400;
var LIGHT_START_Y = 400;
var LIGHT_POINT_SIZE = 8;
var LIGHT_COLOR = 'yellow';
var LIGHT_RAY_RESOLUTION = 2;					//how many rays come from light (360 / LIGHT_RAY_RESOLUTION) min: 1 => 360 rays, max: 360 => 1 rays
var LIGHT_RAY_COLOR = 'grey';

var mapCanvas;
var mapContext;
var linesCanvas;
var linesContext;
var mouseCanvas;
var mouseContext;

var mouseX, mouseY;

var Cord = {
	x: 0,
	y: 0
}

var Light = {
	x: 0,
	y: 0,	
	radius: LIGHT_POINT_SIZE,
	distance: 200,
	color: LIGHT_COLOR,
	rayColor: LIGHT_RAY_COLOR,
	raysEndPoints: new Array()
}

var mapShapes = new Array();

var light;
var isLightMoveMode = false;

function visibility2D_init() {
	initCanvases();
	initMap();	
	initLight();	
	refreshMouseCanvas();	
}

function initCanvases() {
	mapCanvas = document.getElementById("map-canvas-id");
	linesCanvas = document.getElementById("lines-canvas-id");
	mouseCanvas = document.getElementById("mouse-canvas-id");

	mapContext = mapCanvas.getContext("2d");
	linesContext = linesCanvas.getContext("2d");
	mouseContext = mouseCanvas.getContext("2d");

	mapContext.scale(1, 1);
	linesContext.scale(1, 1);
	mouseContext.scale(1, 1);

	let mapCanvasPos = mapCanvas.getBoundingClientRect();
	mapContext.fillStyle = "black";
	mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

	$('#lines-canvas-id').css('position', 'absolute');
	$("#lines-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#lines-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#lines-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#lines-canvas-id").css({ height: mapCanvasPos.height + 'px' });	

	$('#mouse-canvas-id').css('position', 'absolute');
	$("#mouse-canvas-id").css({ top: mapCanvasPos.top + 'px' });	
	$("#mouse-canvas-id").css({ left: mapCanvasPos.left + 'px' });	
	$("#mouse-canvas-id").css({ width: mapCanvasPos.width + 'px' });	
	$("#mouse-canvas-id").css({ height: mapCanvasPos.height + 'px' });
}

function initLight() {
	light = Object.create(Light);
	light.x = LIGHT_START_X;
	light.y = LIGHT_START_Y;	
	refreshLineCanvas();	
	calcCircualLightRays(linesContext, light, mapShapes);
	drawLightRaysTriangle(linesContext, light);
}

function initMap() {
	mapShapes.push(generateMapRectangleShape(700, 50, 100, 20));
	mapShapes.push(generateMapRectangleShape(700, 100, 100, 20));
	mapShapes.push(generateMapRectangleShape(700, 150, 100, 20));
	mapShapes.push(generateMapRectangleShape(700, 200, 100, 20));
	mapShapes.push(generateMapRectangleShape(700, 250, 100, 20));
	mapShapes.push(generateMapRectangleShape(660, 300, 20, 20));
	mapShapes.push(generateMapRectangleShape(700, 300, 20, 20));
	mapShapes.push(generateMapRectangleShape(740, 300, 20, 20));
	mapShapes.push(generateMapRectangleShape(660, 340, 20, 20));
	mapShapes.push(generateMapRectangleShape(700, 340, 20, 20));
	mapShapes.push(generateMapRectangleShape(740, 340, 20, 20));
	mapShapes.push(generateMapRectangleShape(660, 380, 20, 20));
	mapShapes.push(generateMapRectangleShape(700, 380, 20, 20));
	mapShapes.push(generateMapRectangleShape(740, 380, 20, 20));
	mapShapes.push(generateMapCircleShape(400, 400, 60, 10));
}

function generateMapRectangleShape(pivotX, pivotY, width, height) {	
	let resultShape = new Array();
	let coord = Object.create(Cord);
	coord.x = pivotX - (width / 2);
	coord.y = pivotY - (height / 2);
	resultShape.push(coord);
	coord = [];	
	coord.x = pivotX + (width / 2);
	coord.y = pivotY - (height / 2);
	resultShape.push(coord);
	coord = [];
	coord.x = pivotX + (width / 2);
	coord.y = pivotY + (height / 2);
	resultShape.push(coord);
	coord = [];
	coord.x = pivotX - (width / 2);
	coord.y = pivotY + (height / 2);	
	resultShape.push(coord);
	coord = [];
	drawShape(mapContext, resultShape);
	return resultShape;
}

function generateMapCircleShape(pivotX, pivotY, radius, verticleNum) {
	let resultShape = new Array();
	for(let i = 0; i != verticleNum; i++) {
		let coord = Object.create(Cord);
		coord.x = pivotX + Math.cos(Math.PI * 60 / 180) * radius;
  	coord.y = pivotY + Math.sin(Math.PI * 60 / 180) * radius;
		resultShape.push(coord);
		coord = [];				
	}
	drawShape(mapContext, resultShape);
	return resultShape;
}

// ui events ------------------------------------------------------------------
function catchLight() {	
	if(mouseX >= light.x - light.radius && mouseX <= light.x + light.radius &&
		mouseY >= light.y - light.radius && mouseY <= light.y + light.radius) {
			isLightMoveMode = true;
	}
}

function dropLight() {
	isLightMoveMode = false;	
}

// mouse ----------------------------------------------------------------------
function mouseCoordCtrl(event) {	
	mouseX = getMousePos(mouseCanvas, event).x;
	mouseY = getMousePos(mouseCanvas, event).y;
	if(isLightMoveMode) {
		light.x = mouseX;
		light.y = mouseY;
		refreshLineCanvas();
	}
	refreshMouseCanvas();
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: event.clientX - rect.left,
	  y: event.clientY - rect.top
	};
}

// draws ----------------------------------------------------------------------
function refreshMapCanvas() {
	clearCanvas(mapContext);
}

function refreshLineCanvas() {
	clearCanvas(linesContext);	
	drawLight(linesContext, light);	
	if(isLightMoveMode) {				
		calcCircualLightRays(linesContext, light, mapShapes);
		drawLightRaysTriangle(linesContext, light);
		//drawLightRays(linesContext, light);
	}	
}

function refreshMouseCanvas() {
	clearCanvas(mouseContext);	
	mouseContext.fillStyle = 'white';
	mouseContext.fillText("mouse X: " + mouseX + ' Y: ' +  mouseY, 5, 10);
	mouseContext.fillText("light X: " + light.x + ' Y: ' +  light.y, 5, 25);
	mouseContext.fillText("rays distance: " + light.distance, 5, 40);
	mouseContext.fillText("rays number: " + 360 / LIGHT_RAY_RESOLUTION, 5, 55);
}

function clearCanvas(canvasContext) {
	canvasContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
}

function drawShape(canvasContext, shape) {
	if(shape.length < 3)
		return;
	for(let i = 0; i != shape.length; i++) {
		let coordFrom  = shape[i];
		let coordTo;
		if(i + 1 == shape.length)				//ha elér az utolsóig, akkor azt kösse össze az elsővel
			coordTo  = shape[0];
		else
			coordTo  = shape[i + 1];
		drawLine(canvasContext, coordFrom.x, coordFrom.y, coordTo.x, coordTo.y, SHAPE_COLOR);
	}
}

function drawLight(canvasContext, light) {
	canvasContext.beginPath();
	canvasContext.arc(light.x, light.y, LIGHT_POINT_SIZE, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = LIGHT_COLOR;
	canvasContext.fill();
	canvasContext.closePath();	
}

function drawLightRays(canvasContext, light) {
	console.log('light.raysEndPoints.length: ' + light.raysEndPoints.length);
	for(let i = 0; i != light.raysEndPoints.length; i++) {		
		let coordTo  = light.raysEndPoints[i];
		drawLine(canvasContext, light.x, light.y, coordTo.x, coordTo.y, light.rayColor);			
	}
	light.raysEndPoints = [];
}

function drawLightRaysTriangle(canvasContext, light) {
	for(let i = 0; i != light.raysEndPoints.length; i++) {
		let coord1  = light.raysEndPoints[i];
		let coord2;
		if(i < light.raysEndPoints.length - 1) {
			coord2  = light.raysEndPoints[i + 1];
		} else {
			coord2  = light.raysEndPoints[0];
		}
		drawTriangleGardient(canvasContext, light.x, light.y, coord1.x, coord1.y, coord2.x, coord2.y, 'yellow', 'black');
	}
	light.raysEndPoints = [];
}

function drawLineWithAngle(canvasContext, x1, y1, angle, length, color) {
	x2 = x1 + Math.cos(Math.PI * angle / 180) * length;
  y2 = y1 + Math.sin(Math.PI * angle / 180) * length;
	drawLine(canvasContext, x1, y1, x2, y2, color);
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

function drawTriangle(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, borderColor, fillColor) {	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = borderColor;	
	canvasContext.moveTo(lightX, lightY);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	canvasContext.stroke();
}

function drawTriangleGardient(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, insideColor, outSideColor) {
	
	var grd = canvasContext.createRadialGradient(lightX, lightY, 5, lightX, lightY, 200);
	grd.addColorStop(0, insideColor);
	grd.addColorStop(1, outSideColor);
	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = outSideColor;
	canvasContext.stroke();
	canvasContext.strokeStyle = grd;
	canvasContext.moveTo(lightX, lightY);
	canvasContext.lineTo(coord1X, coord1Y);
	canvasContext.lineTo(coord2X, coord2Y);
	canvasContext.fillStyle = grd; //fillColor;
	canvasContext.fill();
	canvasContext.closePath();	 
	canvasContext.stroke();	
}

// math -----------------------------------------------------------------------
function calcCircualLightRays(canvasContext, light, shapes) {	
	let intersectionPoints = new Array();
	for(let angle = 0; angle != 360; angle += LIGHT_RAY_RESOLUTION) {
		let rayEndX = light.x + Math.cos(Math.PI * angle / 180) * light.distance;
  	let rayEndY = light.y + Math.sin(Math.PI * angle / 180) * light.distance;

		for(var j = 0; j != shapes.length; j++) {
			let shape = shapes[j];

			for(let i = 0; i != shape.length; i++) {	//balról jobbra vannak az egyes pontok kiértékelve
				let shapeLineFrom  = shape[i];
				let shapeLineTo;
				if(i + 1 == shape.length) {	//ha elér az utolsóig, akkor azt kösse össze az elsővel
					shapeLineTo  = shape[0];
				}	else {				
					shapeLineTo  = shape[i + 1];
				}			
				let intersectPoint = lineIntersect(light.x, light.y, rayEndX, rayEndY, shapeLineFrom.x, shapeLineFrom.y, shapeLineTo.x, shapeLineTo.y);
				if(intersectPoint != null) {
					intersectionPoints.push(intersectPoint);
				}					
			}						
		}  

		if(intersectionPoints.length == 0 || shapes.length == 0) {	//ha nincs metszés, akkor a ray sugár végig ér a teljes distance-on
			let point = Object.create(Cord);
			point.x = rayEndX;
			point.y = rayEndY;
			light.raysEndPoints.push(point);
		} else if(intersectionPoints.length == 1) {	//ha csak egy metszés van, akkor a metszés pontot mentjük le
			let point = Object.create(Cord);
			point.x = intersectionPoints[0].x;
			point.y = intersectionPoints[0].y;
			light.raysEndPoints.push(point);
		} else if(intersectionPoints.length > 1) {	//ha több metszés van, akkor azt vesszük, amelyik a fényponthoz közelebb van (a távolság a legkisebb)			
			let minDistance = light.distance;
			let minDistancePoint = Object.create(Cord);
			for(let i = 0; i != intersectionPoints.length; i++) {				
				let distance = coordsDistance(light.x, light.y, intersectionPoints[i].x, intersectionPoints[i].y);
				if(distance < minDistance) {
					minDistance = distance;
					minDistancePoint = intersectionPoints[i];
				}
			}
			light.raysEndPoints.push(minDistancePoint);
		}	
		
		intersectionPoints = [];
	}	
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4)
{		
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);   
    if (denom == 0) {	//denimnator == 0 is not divide!
        return null;
    }
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    //console.log('ua, ub  (' + ua + ', ' + ub + ')');

    let m = x1 + ua * (x2 - x1);
    let n = y1 + ua * (y2 - y1); //ub helyett ua !!!
		//console.log('m,n  (' + m + ', ' + n + ')');
					
		if(ua > 0 && ua < 1 && ub > 0 && ub < 1) {	//ekkor metszi egymást a két szakasz
			let intersectPoint = Object.create(Cord);
			intersectPoint.x = m;
			intersectPoint.y = n;
			return intersectPoint;
		} else {
			return null;
		}		
}

function getAngleBetweenCoordsRadian(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1);
}

function getAngleBetweenCoordsDegrees(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function coordsDistance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt((a * a) + (b * b));

}

//https://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle
//http://www.blackpawn.com/texts/pointinpoly/default.html
function is_in_triangle (px, py, ax, ay, bx, by, cx, cy) {
	var v0 = [cx-ax,cy-ay];
	var v1 = [bx-ax,by-ay];
	var v2 = [px-ax,py-ay];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}