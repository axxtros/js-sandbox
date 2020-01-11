//Ebben az állományban csak a shaderek vannak tárolva, hogy a demok és tesztek esetében gyorsabban elérhetőek.
//A végső megoldásban noSQL adatbázisban lesznek eltárolva, és szerver oldalról lesznek átadva az egyes klienseknek.

//draw a point version 1
var VSHADER_SOURCE_DRAW_POINT_VER_1 =
  'void main() {\n' +
  ' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
  ' gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
 var FSHADER_SOURCE_DRAW_POINT_VER_1 =
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
  '}\n';

//draw a point version 2
var VSHADER_SOURCE_DRAW_POINT_VER_2 =
  'attribute vec4 a_position; \n' +
  'attribute float a_size; \n' +
  'void main() {\n' +
  ' gl_Position = a_position;\n' +
  ' gl_PointSize = a_size;\n' +
  '}\n';

// Fragment shader program
 var FSHADER_SOURCE_DRAW_POINT_VER_2 =
  'precision mediump float;\n' +
  'uniform vec4 u_color;\n' +
  'void main() {\n' +
  ' gl_FragColor = u_color;\n' + // Set the color
  '}\n';