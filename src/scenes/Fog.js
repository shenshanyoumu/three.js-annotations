import { Color } from "../math/Color.js";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

/**
 * 所谓雾化，其实类似CSS中的gradient效果
 * @param {*} color 雾化主色调
 * @param {*} near 近视角
 * @param {*} far 远视角
 */
function Fog(color, near, far) {
  this.name = "";

  this.color = new Color(color);

  this.near = near !== undefined ? near : 1;
  this.far = far !== undefined ? far : 1000;
}

Fog.prototype.isFog = true;

Fog.prototype.clone = function() {
  return new Fog(this.color.getHex(), this.near, this.far);
};

Fog.prototype.toJSON = function(/* meta */) {
  return {
    type: "Fog",
    color: this.color.getHex(),
    near: this.near,
    far: this.far
  };
};

export { Fog };
