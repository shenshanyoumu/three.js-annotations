/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from "./Texture.js";
import { CubeReflectionMapping } from "../constants.js";

/**
 * 基于6幅位图来进行立体贴图
 * @param {*} images 位图数组
 * @param {*} mapping
 * @param {*} wrapS
 * @param {*} wrapT
 * @param {*} magFilter
 * @param {*} minFilter
 * @param {*} format
 * @param {*} type
 * @param {*} anisotropy
 * @param {*} encoding
 */
function CubeTexture(
  images,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
  type,
  anisotropy,
  encoding
) {
  images = images !== undefined ? images : [];
  mapping = mapping !== undefined ? mapping : CubeReflectionMapping;

  Texture.call(
    this,
    images,
    mapping,
    wrapS,
    wrapT,
    magFilter,
    minFilter,
    format,
    type,
    anisotropy,
    encoding
  );

  this.flipY = false;
}

CubeTexture.prototype = Object.create(Texture.prototype);
CubeTexture.prototype.constructor = CubeTexture;

CubeTexture.prototype.isCubeTexture = true;

Object.defineProperty(CubeTexture.prototype, "images", {
  get: function() {
    return this.image;
  },

  set: function(value) {
    this.image = value;
  }
});

export { CubeTexture };
