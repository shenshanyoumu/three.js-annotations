/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from "./Texture.js";

/**
 * canvas贴图，即模型表面使用canvas对象作为贴图
 * @param {*} canvas
 * @param {*} mapping
 * @param {*} wrapS
 * @param {*} wrapT
 * @param {*} magFilter
 * @param {*} minFilter
 * @param {*} format
 * @param {*} type
 * @param {*} anisotropy
 */
function CanvasTexture(
  canvas,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
  type,
  anisotropy
) {
  Texture.call(
    this,
    canvas,
    mapping,
    wrapS,
    wrapT,
    magFilter,
    minFilter,
    format,
    type,
    anisotropy
  );

  this.needsUpdate = true;
}

CanvasTexture.prototype = Object.create(Texture.prototype);
CanvasTexture.prototype.constructor = CanvasTexture;

export { CanvasTexture };
