/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Axtros (axtros@gmail.com)
 * 
 */

"use strict";

var canvas;
var gl;
var glShaderProgram = null;

/**
 * WebGL environment common functions.
 */
var WEBGL = (function () {  

  return {
    
    initWebGLContext: function() {
      canvas = document.getElementById("webgl_canvas");
      gl = canvas.getContext('webgl');
      if(!gl) {
        console.log('Failed to get the rendering context for WebGL!');
        return;
      }
    },

    clearCanvas: function() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },

    initShader: function(vertexShaderSource, fragmentShaderSource) {
      let compiledVertexShader = this.compileShader(vertexShaderSource, "VERTEX_SHADER");
      let compiledFragmentShader = this.compileShader(fragmentShaderSource, "FRAGMENT_SHADER");
      glProgram = gl.createProgram();
      gl.attachShader(glProgram, compiledVertexShader);
      gl.attachShader(glProgram, compiledFragmentShader);
      gl.linkProgram(glProgram);
      if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program!");
      }					
      gl.useProgram(glProgram);
    },

    compileShader: function(shaderSource, shaderType) {
      let shader = gl.createShader(shaderType === "VERTEX_SHADER" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
      }
      return shader;
    }

  };

}());