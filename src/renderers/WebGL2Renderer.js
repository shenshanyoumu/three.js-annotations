/**
 * @author mrdoob / http://mrdoob.com/
 */

import { REVISION } from "../constants.js";
import { WebGLExtensions } from "./webgl/WebGLExtensions.js";
import { WebGLState } from "./webgl/WebGLState.js";
import { Color } from "../math/Color.js";
import { Vector4 } from "../math/Vector4.js";

/**
 * 基于WebGL的2D渲染器
 * @param {*} parameters 渲染器设置参数
 */
function WebGL2Renderer(parameters) {
  console.log("THREE.WebGL2Renderer", REVISION);

  parameters = parameters || {};

  //先创建canvas元素
  var _canvas =
      parameters.canvas !== undefined
        ? parameters.canvas
        : document.createElementNS("http://www.w3.org/1999/xhtml", "canvas"),
    _context = parameters.context !== undefined ? parameters.context : null,
    _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
    _depth = parameters.depth !== undefined ? parameters.depth : true,
    _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
    _antialias =
      parameters.antialias !== undefined ? parameters.antialias : false,
    _premultipliedAlpha =
      parameters.premultipliedAlpha !== undefined
        ? parameters.premultipliedAlpha
        : true,
    _preserveDrawingBuffer =
      parameters.preserveDrawingBuffer !== undefined
        ? parameters.preserveDrawingBuffer
        : false,
    _powerPreference =
      parameters.powerPreference !== undefined
        ? parameters.powerPreference
        : "default";

  var gl;

  // 渲染2D场景需要的属性列表
  try {
    var attributes = {
      alpha: _alpha, //像素颜色透明度
      depth: _depth, //深度信息
      stencil: _stencil, //蒙层
      antialias: _antialias, //抗图形边沿锯齿
      premultipliedAlpha: _premultipliedAlpha,
      preserveDrawingBuffer: _preserveDrawingBuffer,
      powerPreference: _powerPreference
    };

    // 在canvas上原生绑定事件
    _canvas.addEventListener("webglcontextlost", onContextLost, false);
    _canvas.addEventListener("webglcontextrestored", function() {});

    // 这一句在WebGL系统中，用于得到WebGL渲染上下文对象
    gl = _context || _canvas.getContext("webgl2", attributes);

    if (gl === null) {
      if (_canvas.getContext("webgl2") !== null) {
        throw new Error(
          "Error creating WebGL2 context with your selected attributes."
        );
      } else {
        throw new Error("Error creating WebGL2 context.");
      }
    }
  } catch (error) {
    console.error("THREE.WebGL2Renderer: " + error.message);
  }

  var _autoClear = true,
    _autoClearColor = true,
    _autoClearDepth = true,
    _autoClearStencil = true,
    _clearColor = new Color(0x000000),
    _clearAlpha = 0,
    _width = _canvas.width,
    _height = _canvas.height,
    _pixelRatio = 1,
    _viewport = new Vector4(0, 0, _width, _height);

  var extensions = new WebGLExtensions(gl);
  var state = new WebGLState(gl, extensions, function() {});

  /**
   *
   * @param {*} color 背景颜色
   * @param {*} depth 背景颜色深度
   * @param {*} stencil 蒙层处理
   */
  function clear(color, depth, stencil) {
    var bits = 0;

    if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
    if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
    if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;

    gl.clear(bits);
  }

  // 渲染画布的尺寸
  function setPixelRatio(value) {
    if (value === undefined) return;

    _pixelRatio = value;

    setSize(_viewport.z, _viewport.w, false);
  }

  function setSize(width, height, updateStyle) {
    _width = width;
    _height = height;

    _canvas.width = width * _pixelRatio;
    _canvas.height = height * _pixelRatio;

    if (updateStyle !== false) {
      _canvas.style.width = width + "px";
      _canvas.style.height = height + "px";
    }

    setViewport(0, 0, width, height);
  }

  // 渲染画布的视口
  function setViewport(x, y, width, height) {
    state.viewport(_viewport.set(x, y, width, height));
  }

  function render(scene, camera) {
    if (camera !== undefined && camera.isCamera !== true) {
      console.error(
        "THREE.WebGL2Renderer.render: camera is not an instance of THREE.Camera."
      );
      return;
    }

    var background = scene.background;
    var forceClear = false;

    if (background === null) {
      state.buffers.color.setClear(
        _clearColor.r,
        _clearColor.g,
        _clearColor.b,
        _clearAlpha,
        _premultipliedAlpha
      );
    } else if (background && background.isColor) {
      state.buffers.color.setClear(
        background.r,
        background.g,
        background.b,
        1,
        _premultipliedAlpha
      );
      forceClear = true;
    }

    if (_autoClear || forceClear) {
      this.clear(_autoClearColor, _autoClearDepth, _autoClearStencil);
    }
  }

  function onContextLost(event) {
    event.preventDefault();
  }

  return {
    domElement: _canvas,
    clear: clear,
    setPixelRatio: setPixelRatio,
    setSize: setSize,
    render: render
  };
}

export { WebGL2Renderer };
