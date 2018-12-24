import { WebGLRenderTarget } from "./WebGLRenderTarget.js";

/**
 * 具有多层画布的渲染器渲染目标
 * @param {*} width 画布宽
 * @param {*} height 画布高
 * @param {*} options 可选参数
 */

function WebGLRenderTargetCube(width, height, options) {
  WebGLRenderTarget.call(this, width, height, options);

  this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
  this.activeMipMapLevel = 0;
}

WebGLRenderTargetCube.prototype = Object.create(WebGLRenderTarget.prototype);
WebGLRenderTargetCube.prototype.constructor = WebGLRenderTargetCube;

WebGLRenderTargetCube.prototype.isWebGLRenderTargetCube = true;

export { WebGLRenderTargetCube };
