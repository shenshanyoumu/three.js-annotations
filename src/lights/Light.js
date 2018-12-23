import { Object3D } from "../core/Object3D.js";
import { Color } from "../math/Color.js";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

/**
 *
 * @param {*} color 光照主色调
 * @param {*} intensity 光照强度
 */
function Light(color, intensity) {
  Object3D.call(this);

  this.type = "Light";

  this.color = new Color(color);
  this.intensity = intensity !== undefined ? intensity : 1;

  // 是否接受阴影效果
  this.receiveShadow = undefined;
}

Light.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Light,

  isLight: true,

  copy: function(source) {
    Object3D.prototype.copy.call(this, source);

    this.color.copy(source.color);
    this.intensity = source.intensity;

    return this;
  },

  toJSON: function(meta) {
    var data = Object3D.prototype.toJSON.call(this, meta);

    data.object.color = this.color.getHex();
    data.object.intensity = this.intensity;

    if (this.groundColor !== undefined)
      data.object.groundColor = this.groundColor.getHex();

    // 被光照的物体距离
    if (this.distance !== undefined) {
      data.object.distance = this.distance;
    }
    if (this.angle !== undefined) data.object.angle = this.angle;

    // 光照强度衰减
    if (this.decay !== undefined) {
      data.object.decay = this.decay;
    }

    // 光照的半影效果
    if (this.penumbra !== undefined) {
      data.object.penumbra = this.penumbra;
    }

    // 光照阴影投射
    if (this.shadow !== undefined) {
      data.object.shadow = this.shadow.toJSON();
    }

    return data;
  }
});

export { Light };
