/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Axtros (axtros@gmail.com)
 * 
 */

"use strict";

var canvas;
var gl;
var VERTEX_SHADER_SOURCE = null;
var FRAGMENT_SHADER_SOURCE = null;

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

    loadShaderfile: function(fileName, shader) {
      var request = new XMLHttpRequest();            
      request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status !== 404) {
          this.onLoadShader(request.responseText, shader);              
        }
      }      
    },

    onLoadShader: function(fileString, shaderType) {
      if(shaderType == gl.VERTEX_SHADER) {
        VERTEX_SHADER_SOURCE = fileString;
      } else if(shaderType == gl.FRAGMENT_SHADER) {
        FRAGMENT_SHADER_SOURCE = fileString;
      }
      if (VERTEX_SHADER_SOURCE && FRAGMENT_SHADER_SOURCE) {
        
        

      }
    }


  };

}());