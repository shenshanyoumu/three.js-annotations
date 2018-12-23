import { Material } from "./Material.js";
import { Color } from "../math/Color.js";

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2()
 * }
 */

/**
 * 精灵材质，常常在碰撞检测使用。精灵在Three中就是一个永远正对着相机的平面，
 * @param {*} parameters
 */
function SpriteMaterial(parameters) {
  Material.call(this);

  this.type = "SpriteMaterial";

  this.color = new Color(0xffffff);
  this.map = null;

  this.rotation = 0;

  this.fog = false;
  this.lights = false;

  this.setValues(parameters);
}

SpriteMaterial.prototype = Object.create(Material.prototype);
SpriteMaterial.prototype.constructor = SpriteMaterial;
SpriteMaterial.prototype.isSpriteMaterial = true;

SpriteMaterial.prototype.copy = function(source) {
  Material.prototype.copy.call(this, source);

  this.color.copy(source.color);
  this.map = source.map;

  this.rotation = source.rotation;

  return this;
};

export { SpriteMaterial };
