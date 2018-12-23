/**
 * @author Matt DesLauriers / @mattdesl
 * @author atix / arthursilber.de
 */

import { Texture } from "./Texture.js";
import {
  NearestFilter,
  UnsignedShortType,
  UnsignedInt248Type,
  DepthFormat,
  DepthStencilFormat
} from "../constants.js";

// 具有深度信息的贴图，在游戏场景/动画场景需要通过贴图实效场景的深度效果
function DepthTexture(
  width,
  height,
  type,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  anisotropy,
  format
) {
  format = format !== undefined ? format : DepthFormat;

  if (format !== DepthFormat && format !== DepthStencilFormat) {
    throw new Error(
      "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
    );
  }

  if (type === undefined && format === DepthFormat) type = UnsignedShortType;
  if (type === undefined && format === DepthStencilFormat)
    type = UnsignedInt248Type;

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
    anisotropy
  );

  this.image = { width: width, height: height };

  this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
  this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

  this.flipY = false;
  this.generateMipmaps = false;
}

DepthTexture.prototype = Object.create(Texture.prototype);
DepthTexture.prototype.constructor = DepthTexture;
DepthTexture.prototype.isDepthTexture = true;

export { DepthTexture };
