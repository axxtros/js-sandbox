/**
 * 10/01/2020
 * axtros (axtros@gmail.com)  
 * 
 * WebGL common and utility module.
 * (This module use the Module pattern. Tutorial and examples: https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s03.html)
 */

"use strict";

//global variables
var canvas;
var gl;

/**
 * WebGL environment common functions.
 */
var WEBGL = (function () {

  //private variables and functions    
  const SahderType = {
    "VERTEX_SHADER": 1, 
    "FRAGMENT_SHADER": 2
  }
  
  function compileShader(shaderSource, shaderType) {
    let shader = gl.createShader(shaderType === SahderType.VERTEX_SHADER ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  //public variables and functions    
  return {

    //variables
    shaderType: SahderType,

    //functions
    initWebGLContext: function() {
      canvas = document.getElementById("webgl_canvas");
      gl = canvas.getContext('webgl');
      if(!gl) {
        console.log('Failed to get the rendering context for WebGL!');
        return;
      }      
    },

    clearCanvasBlack: function() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);          //Not optimal, that always set color, when call the screen cleaner! Move this line in the context init function. !!!
      gl.clear(gl.COLOR_BUFFER_BIT);
    },

    //Shader init come from Beginning WebGL for HTML5 book.
    initShaders: function(vertexShaderSource, fragmentShaderSource) {      
      let compiledVertexShader = compileShader(vertexShaderSource, SahderType.VERTEX_SHADER);
      let compiledFragmentShader = compileShader(fragmentShaderSource, SahderType.FRAGMENT_SHADER);
      let program = gl.createProgram();
      gl.attachShader(program, compiledVertexShader);
      gl.attachShader(program, compiledFragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program!");
      }					
      gl.useProgram(program);      
    },

    /**
     * Return the current WebGL program.
     */
    getCurrentProgram: function() {
      return gl.getParameter(gl.CURRENT_PROGRAM);
    }

  };

}()); //WEBGL end