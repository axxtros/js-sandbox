//2d_visibility
//2D light with raytracing solution.
//13/05/2019 axtros@gmail.com

var SHAPE_COLOR = '#adadad';

var LIGHT_START_X = 400;
var LIGHT_START_Y = 400;
var LIGHT_POINT_SIZE = 8;
var LIGHT_COLOR = 'red';
var LIGHT_RAY_RESOLUTION = 4;					//how many rays come from light (360 / LIGHT_RAY_RESOLUTION) min: 1 => 360 rays, max: 360 => 1 rays
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

var shape1 = new Array();
var shape2 = new Array();
var shape3 = new Array();

var light;
var isLightMoveMode = false;

function visibility2D_init() {
	initCanvases();
	initShape1();
	initShape2();	
	initShape3();
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
	shapePoint1.x = 100;
	shapePoint1.y = 200;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 300;
	shapePoint2.y = 200;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 300;
	shapePoint3.y = 700;

	shape1.push(shapePoint1);
	shape1.push(shapePoint2);
	shape1.push(shapePoint3);	

	drawShape(mapContext, shape1);
}

function initShape2() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 600;
	shapePoint1.y = 200;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 700;
	shapePoint2.y = 200;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 700;
	shapePoint3.y = 700;

	let shapePoint4 = Object.create(Cord);
	shapePoint4.x = 450;
	shapePoint4.y = 300;	

	shape2.push(shapePoint1);
	shape2.push(shapePoint2);
	shape2.push(shapePoint3);	
	shape2.push(shapePoint4);

	drawShape(mapContext, shape2);
}

function initShape3() {
	let shapePoint1 = Object.create(Cord);
	shapePoint1.x = 300;
	shapePoint1.y = 100;

	let shapePoint2 = Object.create(Cord);
	shapePoint2.x = 400;
	shapePoint2.y = 100;

	let shapePoint3 = Object.create(Cord);
	shapePoint3.x = 400;
	shapePoint3.y = 200;

	let shapePoint4 = Object.create(Cord);
	shapePoint4.x = 400;
	shapePoint4.y = 200;	

	let shapePoint5 = Object.create(Cord);
	shapePoint5.x = 600;
	shapePoint5.y = 200;	

	shape3.push(shapePoint1);
	shape3.push(shapePoint2);
	shape3.push(shapePoint3);	
	shape3.push(shapePoint4);
	shape3.push(shapePoint5);

	drawShape(mapContext, shape3);
}

function initLight() {
	light = Object.create(Light);
	light.x = LIGHT_START_X;
	light.y = LIGHT_START_Y;	
	refreshLineCanvas();	
	let shapes = [shape2, shape1, shape3];
	calcCircualLightRays(linesContext, light, shapes);
	drawLightRaysTriangle(linesContext, light);
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
		let shapes = [shape2, shape1, shape3];
		calcCircualLightRays(linesContext, light, shapes);
		drawLightRaysTriangle(linesContext, light);
		//drawLightRays(linesContext, light);
	}	
}

function refreshMouseCanvas() {
	clearCanvas(mouseContext);	
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
		drawTriangle(canvasContext, light.x, light.y, coord1.x, coord1.y, coord2.x, coord2.y, '#ff7070', 'red');
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

function drawTriangleGardient(canvasContext, lightX, lightY, coord1X, coord1Y, coord2X, coord2Y, borderColor, fillColor) {
	
	var grd = canvasContext.createRadialGradient(lightX, lightY, 5, lightX, lightY, 200);
	grd.addColorStop(0, "red");
	grd.addColorStop(1, "white");	
	
	canvasContext.beginPath();	
	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = borderColor;
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

		if(intersectionPoints.length == 0) {	//ha nincs metszés, akkor a ray sugár végig ér a teljes distance-on
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

/*
//https://stackoverflow.com/questions/17456783/javascript-figure-out-point-y-by-angle-and-distance
let xxx = originalPoint.x + Math.cos(angle * Math.PI / 180) * (800 - originalPoint.x);
let yyy = originalPoint.y + Math.sin(angle * Math.PI / 180) * (800 - originalPoint.y);
drawLine(linesContext, originalPoint.x, originalPoint.y, xxx, yyy, 'red');
*/

//https://stackoverflow.com/questions/4928566/how-to-get-points-x-y-coordinates-from-line-angle
//https://stackoverflow.com/questions/11907947/how-to-check-if-a-point-lies-on-a-line-between-2-other-points

/*
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
	}
}
	  */	