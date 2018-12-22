import { _Math } from "./Math.js";

// 球面坐标系，其中参数
/**
 *
 * @param {*} radius 球面半径
 * @param {*} phi 球面坐标系中，向量与极轴的夹角
 * @param {*} theta 球面坐标系中，向量投影到赤道平面上与“3点方向”的夹角
 */
function Spherical(radius, phi, theta) {
  this.radius = radius !== undefined ? radius : 1.0;
  this.phi = phi !== undefined ? phi : 0;
  this.theta = theta !== undefined ? theta : 0;

  return this;
}

Object.assign(Spherical.prototype, {
  set: function(radius, phi, theta) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  },

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(other) {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  },

  // 球面坐标系中，需要保证向量与极轴的夹角不能大于Math.PI
  makeSafe: function() {
    var EPS = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;
  },

  setFromVector3: function(vec3) {
    this.radius = vec3.length();

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis
      this.phi = Math.acos(_Math.clamp(vec3.y / this.radius, -1, 1)); // polar angle
    }

    return this;
  }
});

export { Spherical };
