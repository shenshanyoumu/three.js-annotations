import { Vector2 } from "./Vector2.js";

/**
 * 二维区域对象
 * @param {*} min 左下角二维向量
 * @param {*} max 右上角二维向量
 */
function Box2(min, max) {
  this.min = min !== undefined ? min : new Vector2(+Infinity, +Infinity);
  this.max = max !== undefined ? max : new Vector2(-Infinity, -Infinity);
}

Object.assign(Box2.prototype, {
  set: function(min, max) {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  },

  // 给定一系列二维点，构建一个最小二维区域并能够包含所有点
  setFromPoints: function(points) {
    this.makeEmpty();

    for (var i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  },

  // 根据给定中心坐标和区域宽/高尺寸，返回生成的二维区域对象
  setFromCenterAndSize: (function() {
    var v1 = new Vector2();

    /**
     * 参数center，表示给定区域的中心坐标
     * 参数size，表示给定区域的宽/高尺寸
     */
    return function setFromCenterAndSize(center, size) {
      var halfSize = v1.copy(size).multiplyScalar(0.5);
      this.min.copy(center).sub(halfSize);
      this.max.copy(center).add(halfSize);

      return this;
    };
  })(),

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(box) {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  },

  // 二维区域无限大。
  makeEmpty: function() {
    this.min.x = this.min.y = +Infinity;
    this.max.x = this.max.y = -Infinity;

    return this;
  },

  // 判定二维区域对象是否为空，即判定区域的边界
  isEmpty: function() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  },

  // 参数target类似C++中的引用传参
  getCenter: function(target) {
    if (target === undefined) {
      console.warn("THREE.Box2: .getCenter() target is now required");
      target = new Vector2();
    }

    return this.isEmpty()
      ? target.set(0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  },

  // 获得二维区域的尺寸
  getSize: function(target) {
    if (target === undefined) {
      console.warn("THREE.Box2: .getSize() target is now required");
      target = new Vector2();
    }

    return this.isEmpty()
      ? target.set(0, 0)
      : target.subVectors(this.max, this.min);
  },

  /**
   * 当前二维区域与给定的二维点，扩展区域大小使得包含所有点
   * @param {*} point 给定的二维点
   */
  expandByPoint: function(point) {
    this.min.min(point);
    this.max.max(point);

    return this;
  },

  //基于向量扩展二维区域，使得新的区域包含该向量
  expandByVector: function(vector) {
    this.min.sub(vector);
    this.max.add(vector);

    return this;
  },

  expandByScalar: function(scalar) {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);

    return this;
  },

  // 判定给定二维点是否在区域内
  containsPoint: function(point) {
    return point.x < this.min.x ||
      point.x > this.max.x ||
      point.y < this.min.y ||
      point.y > this.max.y
      ? false
      : true;
  },

  // 对两个二维区域判断包含关系
  containsBox: function(box) {
    return (
      this.min.x <= box.min.x &&
      box.max.x <= this.max.x &&
      this.min.y <= box.min.y &&
      box.max.y <= this.max.y
    );
  },

  // 根据给定point，计算该point在二维区域的参数化值，并返回target结果
  getParameter: function(point, target) {
    if (target === undefined) {
      console.warn("THREE.Box2: .getParameter() target is now required");
      target = new Vector2();
    }

    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y)
    );
  },

  // 两个二维盒子的相交检测
  intersectsBox: function(box) {
    return box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y
      ? false
      : true;
  },

  // 根据给定point和当前二维区域，得到clap点
  clampPoint: function(point, target) {
    if (target === undefined) {
      console.warn("THREE.Box2: .clampPoint() target is now required");
      target = new Vector2();
    }

    return target.copy(point).clamp(this.min, this.max);
  },

  // 可以相信对于给定point，先计算在二维区域的clap点，然后计算clap点与point点的距离
  // 这个方法的意义待确定
  distanceToPoint: (function() {
    var v1 = new Vector2();

    return function distanceToPoint(point) {
      var clampedPoint = v1.copy(point).clamp(this.min, this.max);
      return clampedPoint.sub(point).length();
    };
  })(),

  // 得到两个二维区域的重叠区域
  intersect: function(box) {
    this.min.max(box.min);
    this.max.min(box.max);

    return this;
  },

  // 得到包含两个二维区域的最小区域
  union: function(box) {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  },

  // 二维区域的平移过程
  translate: function(offset) {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  },

  // 判定两个二维区域是否相等
  equals: function(box) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
});

export { Box2 };
