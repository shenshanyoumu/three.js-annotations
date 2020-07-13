import { Matrix4 } from "../math/Matrix4.js";
import { Vector2 } from "../math/Vector2.js";

/**
 * @author mrdoob / http://mrdoob.com/
 */

/**
 * 光照的阴影效果需要相机角度的配合
 * @param {*} camera
 */
function LightShadow(camera) {
  // 光照影响的可视区域，即只对相机观察到的空间进行阴影处理
  this.camera = camera;

  // 对场景对象的深度值进行偏移，用于决定模型是否处于阴影
  this.bias = 0;

  // 处理半阴影，即为了得到更好的渲染效果需要对阴影边缘的处理
  this.radius = 1;

  this.mapSize = new Vector2(512, 512);

  // 阴影映射过程
  this.map = null;
  this.matrix = new Matrix4();
}

Object.assign(LightShadow.prototype, {
  copy: function(source) {
    this.camera = source.camera.clone();

    //
    this.bias = source.bias;
    this.radius = source.radius;

    // 二维向量，决定阴影映射的区域尺寸
    this.mapSize.copy(source.mapSize);

    return this;
  },

  clone: function() {
    return new this.constructor().copy(this);
  },

  toJSON: function() {
    var object = {};

    if (this.bias !== 0) object.bias = this.bias;
    if (this.radius !== 1) object.radius = this.radius;
    if (this.mapSize.x !== 512 || this.mapSize.y !== 512)
      object.mapSize = this.mapSize.toArray();

    object.camera = this.camera.toJSON(false).object;
    delete object.camera.matrix;

    return object;
  }
});

export { LightShadow };
