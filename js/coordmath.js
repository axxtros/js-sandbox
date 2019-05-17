//coordmath.js
//coordinate geometry mathematical functions
//17/05/2019 axtros@gmail.com

var cord = {
	x: 0,
	y: 0
}

//Ha van, akkor visszaadja két szakasz metszéspontját. (line1: x1, y1, x2, y2 | line2: x3, y3, x4, y4)
function calcLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	let intersectPoint = null;
  let ua, ub;
  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);   
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
		intersectPoint = Object.create(cord);
		intersectPoint.x = m;
		intersectPoint.y = n;		
	}
	return intersectPoint;	
}

//Visszaadja egy megadott koordinátától, adott szögben, és távolságban lévő új koordinátát.
function calcCoordsLineWithAngle(x, y, angle, distance) {
	point = Object.create(cord);
	point.x = x + Math.cos(Math.PI * angle / 180) * distance;
  point.y = y + Math.sin(Math.PI * angle / 180) * distance;
  return point;
}

//Visszaadja két pont közötti szöget, fokban.
function calcAngleBetweenCoordsDegrees(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

//Visszaadja két pont közötti szöget, radiánban.
function calcAngleBetweenCoordsRadian(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1);
}

//Visszaadja két koordináta közötti távolságot.
function calcCoordsDistance(x1, y1, x2, y2) {
	var xDist = x1 - x2;
	var yDist = y1 - y2;
	return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

//True, ha a pointX, pointY koordináta rajta van a lineX1, lineY1, lineX2, lineY2 által meghatározott egyenesen.
function checkPointOnLine(lineX1, lineY1, lineX2, lineY2, pointX, pointY) {
	var slope = (lineY2 - lineY1) / (lineX2 - lineX1);
	var newSlope = (lineY2 - pointY) / (lineX2 - pointX);
	if (slope == newSlope && pointX > lineX1 && pointX < lineX2 && pointY > lineY1 && pointY < lineY2) {
		return true;
	}
	return false;
}

//True, ha a px, py pont benne van az ax, ay, bx, by, cx, cy pontok által határolt háromszögben.
//https://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle
//http://www.blackpawn.com/texts/pointinpoly/default.html
function checkPointIsInTriangle(px, py, ax, ay, bx, by, cx, cy) {
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

//Egy megadott pivotX, pivotY pont körül megadott szögben elforgatja a pointX, pointY által megadott pontot, és az új koordinátáját adja vissza.
function rotatePoint(pivotX, pivotY, angle, pointX, pointY) {
  pointX -= pivotX;
  pointY -= pivotY;

  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  let xnew = (pointX * cos) - (pointY * sin);
  let ynew = (pointX * sin) + (pointY * cos);

  point = Object.create(cord);
  point.x = xnew + pivotX;
  point.y = ynew + pivotY;
  return point;
}