//  柱面坐标系，radius表示柱面截面半径，theta表示柱面顺时针旋转角度，而Y表示柱面在X-Z平面上的高度
function Cylindrical(radius, theta, y) {
  this.radius = radius !== undefined ? radius : 1.0; // X-Z平面的圆柱半径

  // 从Y轴正方向逆时针旋转的弧度，如果为2PI，则表示完整的圆柱；否则只是圆柱部分剖面
  this.theta = theta !== undefined ? theta : 0; 
  this.y = y !== undefined ? y : 0; // 圆柱高度

  return this;
}

Object.assign(Cylindrical.prototype, {
  set: function(radius, theta, y) {
    this.radius = radius;
    this.theta = theta;
    this.y = y;

    return this;
  },

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(other) {
    this.radius = other.radius;
    this.theta = other.theta;
    this.y = other.y;

    return this;
  },

  // 从三维向量计算得到圆柱体对象
  setFromVector3: function(vec3) {
    this.radius = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
    this.theta = Math.atan2(vec3.x, vec3.z);
    this.y = vec3.y;

    return this;
  }
});

export { Cylindrical };
