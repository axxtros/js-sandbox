"use strict";

var glProgram = null;
var vertexShader = null;
var fragmentShader = null;

var a_position;
var a_size;
var u_color;
var Point = {
  x: 0,
  y: 0
}
var pointArray = new Array();

function main() {  
  WEBGL.initWebGLContext();    
  WEBGL.initShaders(VSHADER_SOURCE_DRAW_POINT_VER_2, FSHADER_SOURCE_DRAW_POINT_VER_2);
  canvas.addEventListener("click", onMouseClick, false);
  
  let glProgram = WEBGL.getCurrentProgram();
  a_position = gl.getAttribLocation(glProgram, 'a_position');    
  a_size = gl.getAttribLocation(glProgram, 'a_size');
  u_color = gl.getUniformLocation(glProgram, 'u_color');
  
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(a_size, 5.0);

  WEBGL.clearCanvasBlack();
  gl.drawArrays(gl.POINTS, 0, 1);  
}

function onMouseClick(ev) {
  let rect = canvas.getBoundingClientRect();
  let x = ev.clientX;
  let y = ev.clientY;

  x = ((x - rect.left) - (canvas.height / 2)) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  console.log('x: ' + x + ' y: ' + y);
  
  let point = Object.create(Point);
  point.x = x;
  point.y = y;
  pointArray.push(point);

  drawPoint();
}

function drawPoint() {
  WEBGL.clearCanvasBlack();
  for(let i = 0; i != pointArray.length; i++) {
    gl.vertexAttrib3f(a_position, pointArray[i].x, pointArray[i].y, 0.0);
    gl.uniform4f(u_color, 1.0, 1.0, 0.0, 1.0);  
    gl.drawArrays(gl.POINTS, 0, 1);
  }  
}

