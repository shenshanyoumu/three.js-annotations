import { Object3D } from "../../core/Object3D.js";

/**
 *
 * @param {*} material 3D模型的材质，用于反应纹理和光照
 */
function ImmediateRenderObject(material) {
  Object3D.call(this);

  this.material = material;
  this.render = function() {};
}

ImmediateRenderObject.prototype = Object.create(Object3D.prototype);
ImmediateRenderObject.prototype.constructor = ImmediateRenderObject;

ImmediateRenderObject.prototype.isImmediateRenderObject = true;

export { ImmediateRenderObject };
