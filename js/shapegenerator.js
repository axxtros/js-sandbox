//shapegenerator.js
//Generating different shape for 2d map.
//17/05/2019 axtros@gmail.com

function generateTriangle(pivotX, pivotY, height) {
	return generateMapCircleShape(pivotX, pivotY, height, 60, 3, false);
}

function generateMapCircleShape(pivotX, pivotY, triangleHeight, radius, sideNum, isWithPivotPoint) {
	let resultShape = new Array();
	let coord = Object.create(Cord);
	if(isWithPivotPoint) {
		coord.x = pivotX;
		coord.y = pivotY;
		resultShape.push(coord);
	}
	for(let i = 0; i != sideNum; i++) {
		resultShape.push(calcCoordsLineWithAngle(pivotX, pivotY, radius * i, triangleHeight));		
	}
	return resultShape;
}

function generateMapRectangleShapeWithAngle(pivotX, pivotY, width, height, angle) {	
	let shape = generateMapRectangleShape(pivotX, pivotY, width, height);
	return rotateShape(pivotX, pivotY, shape, angle);
}

function rotateShape(pivotX, pivotY, shape, angle) {
	for(let coordIdx = 0; coordIdx != shape.length; coordIdx++) {
		shape[coordIdx] = rotatePoint(pivotX, pivotY, angle, shape[coordIdx].x, shape[coordIdx].y);
	}
	return shape;
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
	return resultShape;
}