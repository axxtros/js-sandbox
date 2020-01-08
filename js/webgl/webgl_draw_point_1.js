"use strict";

function init() {
  WEBGL.initWebGLContext();
  WEBGL.clearCanvas();
}

function main() {  
  init();

  WEBGL.loadShaderfile('draw_point_1.vert', gl.VERTEX_SHADER);
  WEBGL.loadShaderfile('draw_point_1.frag', gl.FRAGMENT_SHADER);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1);
}