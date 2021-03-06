import { Material } from "./Material.js";
import { Color } from "../math/Color.js";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>
 * }
 */

/**
 * 点材质常用于点云系统
 * @param {*} parameters
 */
function PointsMaterial(parameters) {
  Material.call(this);

  this.type = "PointsMaterial";

  this.color = new Color(0xffffff);

  this.map = null;

  this.size = 1;

  // 随着与相机距离的变化而产生点模型尺寸变小的视觉模拟
  this.sizeAttenuation = true;

  this.lights = false;

  this.setValues(parameters);
}

PointsMaterial.prototype = Object.create(Material.prototype);
PointsMaterial.prototype.constructor = PointsMaterial;

PointsMaterial.prototype.isPointsMaterial = true;

PointsMaterial.prototype.copy = function(source) {
  Material.prototype.copy.call(this, source);

  this.color.copy(source.color);

  this.map = source.map;

  this.size = source.size;
  this.sizeAttenuation = source.sizeAttenuation;

  return this;
};

export { PointsMaterial };
