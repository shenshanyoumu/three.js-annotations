/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Texture } from "./Texture.js";

/**
 * 基于压缩格式的数据进行贴图
 * @param {*} mipmaps MIPMAP位图数组
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
function CompressedTexture(
  mipmaps,
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

  this.image = { width: width, height: height };
  this.mipmaps = mipmaps;

  // no flipping for cube textures
  // (also flipping doesn't work for compressed textures )

  this.flipY = false;

  // can't generate mipmaps for compressed textures
  // mips must be embedded in DDS files

  this.generateMipmaps = false;
}

CompressedTexture.prototype = Object.create(Texture.prototype);
CompressedTexture.prototype.constructor = CompressedTexture;

CompressedTexture.prototype.isCompressedTexture = true;

export { CompressedTexture };
