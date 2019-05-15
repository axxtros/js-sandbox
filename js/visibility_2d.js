//2d_visibility
//13/05/2019 axtros@gmail.com

var SHAPE_COLOR = '#adadad';
var LIGHT_POINT_SIZE = 8;
var LIGHT_COLOR = 'red';

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
	size: LIGHT_POINT_SIZE,
	radius: LIGHT_POINT_SIZE,
	color: LIGHT_COLOR,
	raysEndPoints: new Array()
}

var shape1 = new Array();

var light;
var isLightMoveMode = false;

function visibility2D_init() {
	initCanvases();

	initShape1();	

	initLight();	
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

function initShape1() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 200;
	shapePoint1.y = 200;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 300;
	shapePoint2.y = 200;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 300;
	shapePoint3.y = 300;
	/*
	let shapePoint4 = Object.create(Cord);
	shapePoint4.x = 200;
	shapePoint4.y = 300;
	*/
	shape1.push(shapePoint1);
	shape1.push(shapePoint2);
	shape1.push(shapePoint3);
	//shape1.push(shapePoint4);

	drawShape(mapContext, shape1);
}

function initLight() {
	light = Object.create(Light);
	light.x = 400;
	light.y = 400;
	refreshLineCanvas();
	drawLightRays(linesContext, light);	
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
	drawLight(linesContext, light.x, light.y);	
	if(isLightMoveMode) {
		light.raysEndPoints = [];
		drawLightRays(linesContext, light);
	}	
}

function refreshMouseCanvas() {
	clearCanvas(mouseContext);	
	mouseContext.fillText("X:" + mouseX + ' Y:' +  mouseY, 5, 10);
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

function drawLight(canvasContext, x, y) {
	canvasContext.beginPath();
	canvasContext.arc(x, y, LIGHT_POINT_SIZE, 0, 2 * Math.PI, false);	
	canvasContext.fillStyle = LIGHT_COLOR;
	canvasContext.fill();
	canvasContext.closePath();	
}

function drawLightRays(canvasContext, light) {
	//four corner
	/*	
	checkRayIntersect(light, 0, 0, shape1, false);
	checkRayIntersect(light, linesCanvas.width, 0, shape1, true);
	checkRayIntersect(light, linesCanvas.width, linesCanvas.height, shape1, true);
	checkRayIntersect(light, 0, linesCanvas.height, shape1, false);	
	*/

	//all shape verticles
	for(let i = 0; i != shape1.length; i++) {
		let shapeCoord = shape1[i];
		checkRayIntersect(light, shapeCoord.x, shapeCoord.y, shape1, false);
	}

	console.log('light.raysEndPoints.length: ' + light.raysEndPoints.length);

	for(let i = 0; i != light.raysEndPoints.length; i++) {
		let coordTo  = light.raysEndPoints[i];
		drawLine(canvasContext, light.x, light.y, coordTo.x, coordTo.y, light.color);
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

// math -----------------------------------------------------------------------

function checkRayIntersect(light, rayOriginX, rayOriginY, shape, isLeft) {
	let isInersect = false;
	let intersectPoint = null;
	
	if(!isLeft) {

		for(let i = 0; i != shape.length; i++) {	//balról jobbra vannak az egyes pontok kiértékelve
			let shapeLineFrom  = shape[i];
			let shapeLineTo;
			if(i + 1 == shape.length)				//ha elér az utolsóig, akkor azt kösse össze az elsővel
				shapeLineTo  = shape[0];
			else
				shapeLineTo  = shape[i + 1];
			intersectPoint = lineIntersect(light.x, light.y, rayOriginX, rayOriginY, shapeLineFrom.x, shapeLineFrom.y, shapeLineTo.x, shapeLineTo.y);
			if(intersectPoint != null) {
				isInersect = true;
				break;
			}		
		}

	} else {

		for(let i = shape.length; i != 0; i--) {	//jobbrol balra vannak az egyes pontok kiértékelve
			let shapeLineFrom;
			if(i == shape.length) {
				shapeLineFrom  = shape[0];
			} else {
				shapeLineFrom  = shape[i];
			}	
			let shapeLineTo  = shape[i - 1];

			intersectPoint = lineIntersect(light.x, light.y, rayOriginX, rayOriginY, shapeLineFrom.x, shapeLineFrom.y, shapeLineTo.x, shapeLineTo.y);
			if(intersectPoint != null) {
				isInersect = true;
				break;
			}		
		}

	}

	if(isInersect) {
		light.raysEndPoints.push(intersectPoint);
	} else {
		let originalPoint = Object.create(Cord);
		originalPoint.x = rayOriginX;
		originalPoint.y = rayOriginY;
		light.raysEndPoints.push(originalPoint);

		let angle = getAngleBetweenCoordsRadian(light.x, light.y, originalPoint.x, originalPoint.y);
		let pAngle = angle + 0.00001;
		let nAngle = angle - 0.00001;

		let x2 = originalPoint.x + Math.cos(Math.PI * angle / 180) * 1;
  	let y2 = originalPoint.y + Math.sin(Math.PI * angle / 180) * 1;  	

		/*
		let angle = getAngleBetweenCoordsDegrees(light.x, light.y, originalPoint.x, originalPoint.y);		
		let x2 = originalPoint.x + Math.cos(Math.PI * angle / 180) * 1;
  	let y2 = originalPoint.y + Math.sin(Math.PI * angle / 180) * 1;  	

		//szögek utáni tovább húzása a sugárnak, de azt ne húzza tovább, amely átmenne a shape-en
		if(!is_in_triangle(x2, y2, shape[0].x, shape[0].y, shape[1].x, shape[1].y, shape[2].x, shape[2].y)) {
			let calcPoint = Object.create(Cord);
			x2 = originalPoint.x + Math.cos(Math.PI * angle / 180) * 200;
  		y2 = originalPoint.y + Math.sin(Math.PI * angle / 180) * 200;
			calcPoint.x = x2;
			calcPoint.y = y2;
			light.raysEndPoints.push(calcPoint);
		}
	  */	
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

/*
//https://stackoverflow.com/questions/17456783/javascript-figure-out-point-y-by-angle-and-distance
let xxx = originalPoint.x + Math.cos(angle * Math.PI / 180) * (800 - originalPoint.x);
let yyy = originalPoint.y + Math.sin(angle * Math.PI / 180) * (800 - originalPoint.y);
drawLine(linesContext, originalPoint.x, originalPoint.y, xxx, yyy, 'red');
*/

//https://stackoverflow.com/questions/4928566/how-to-get-points-x-y-coordinates-from-line-angle