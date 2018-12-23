/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Texture } from "./Texture.js";
import { NearestFilter } from "../constants.js";

/**
 * 所谓数据贴图，其实需要依赖数据类型和格式的贴图。如果类型为THREE.UnsignedByteType，则使用Uint8Array来声明纹素数据
 * @param {*} data 原始的数据源
 * @param {*} width
 * @param {*} height
 * @param {*} format
 * @param {*} type
 * @param {*} mapping
 * @param {*} wrapS
 * @param {*} wrapT
 * @param {*} magFilter
 * @param {*} minFilter
 * @param {*} anisotropy
 * @param {*} encoding
 */
function DataTexture(
  data,
  width,
  height,
  format,
  type,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  anisotropy,
  encoding
) {
  Texture.call(
    this,
    null,
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

  this.image = { data: data, width: width, height: height };

  this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
  this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

  this.generateMipmaps = false;
  this.flipY = false;
  this.unpackAlignment = 1;
}

DataTexture.prototype = Object.create(Texture.prototype);
DataTexture.prototype.constructor = DataTexture;

DataTexture.prototype.isDataTexture = true;

export { DataTexture };
